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
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-media", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}
