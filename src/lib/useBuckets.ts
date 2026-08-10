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

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function createUploadUrl(filename: string, contentType: string) {
  const extension = filename.split(".").pop();
  const key = `${crypto.randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  return {
    uploadUrl,
    key,
    url: `${process.env.S3_PUBLIC_URL}/${process.env.S3_BUCKET}/${key}`,
  };
}

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
    console.error(error);
  }
}

export function extractKeyFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] ?? "";
}

export async function uploadFile(file: File) {
  // Get upload URL
  const response = await fetch("/api/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create upload URL");
  }

  const { uploadUrl, url, key } = await response.json();

  // Upload directly to S3
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file");
  }

  return {
    url,
    key,
  };
}
