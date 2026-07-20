import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
