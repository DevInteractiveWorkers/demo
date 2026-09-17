import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: process.env.S3_ACCESS!,
    secretAccessKey: process.env.S3_SECRET!,
  },
  forcePathStyle: true,
});

export async function uploadFileToBucket(file: File) {
  const extension = file.name.split(".").pop();
  const key = `${crypto.randomUUID()}.${extension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }),
  );

  return {
    fileName: key,
    bucket: process.env.S3_BUCKET!,
    key,
    url: `${process.env.S3_PUBLIC_URL}/${process.env.S3_BUCKET!}/${key}`,
  };
}

export async function deleteFileFromBucket(key: string) {
  if (!key) return;

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
      }),
    );
  } catch (error) {
    // Best-effort cleanup: don't let a missing object (or a transient S3
    // error) block deletion of the Firestore doc that referenced it.
    console.error(`Failed to delete "${key}" from bucket:`, error);
  }
}

// Stored candidate fields are full public URLs
// (`${S3_PUBLIC_URL}/${S3_BUCKET}/${key}`), not bare keys. Since keys are
// flat (`${uuid}.${extension}`, no folders), the key is just the last
// path segment.
export function extractKeyFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] ?? "";
}

export async function uploadFile(file: File) {
  // Step 1: ask our server for a presigned PUT URL (small JSON request,
  // never hits Vercel's body-size limit).
  let presignData: {
    success: boolean;
    uploadUrl: string;
    url: string;
    error?: string;
  };

  try {
    const presignRes = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
      }),
    });

    presignData = await presignRes.json();

    if (!presignRes.ok || !presignData.success) {
      throw new Error(presignData.error ?? "Failed to obtain upload URL");
    }
  } catch (error) {
    throw new Error(
      `Could not prepare upload for "${file.name}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  // Step 2: PUT the file directly to S3/RustFS, bypassing Vercel entirely.
  try {
    const putRes = await fetch(presignData.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!putRes.ok) {
      throw new Error(`Storage rejected the upload (status ${putRes.status})`);
    }
  } catch (error) {
    throw new Error(
      `Failed to upload "${file.name}" to storage: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  // Keep the same return shape the rest of the app expects
  // ({ url, ... }) so uploadMediaFiles() needs no changes.
  return {
    url: presignData.url,
  };
}
