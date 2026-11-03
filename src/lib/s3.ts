// Server-side only: holds S3 credentials. Never import this from a client
// component — use `uploadFile` from "./uploadMedia" for browser uploads.
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: process.env.S3_ACCESS!,
    secretAccessKey: process.env.S3_SECRET!,
  },
  forcePathStyle: true,
});

// Keys are flat (`${uuid}.${extension}`, no folders). Existing records
// depend on this format — do not change it.
export function buildObjectKey(fileName: string) {
  const extension = fileName.split(".").pop();
  return `${crypto.randomUUID()}.${extension}`;
}

export function getPublicUrl(key: string) {
  return `${process.env.S3_PUBLIC_URL}/${process.env.S3_BUCKET!}/${key}`;
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
// flat, the key is just the last path segment.
export function extractKeyFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] ?? "";
}
