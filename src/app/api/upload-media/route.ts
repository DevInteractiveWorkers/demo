// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const data = await req.formData();

//   const file = data.get("file") as File;

//   if (!file) {
//     return NextResponse.json({ error: "No file provided" }, { status: 400 });
//   }

//   const ghlForm = new FormData();

//   ghlForm.append("file", file);

//   const response = await fetch(
//     "https://services.leadconnectorhq.com/medias/upload-file",
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.GHL_TOKEN}`,
//         Version: "2021-07-28",
//       },
//       body: ghlForm,
//     },
//   );

//   const result = await response.json();

//   return NextResponse.json(result);
// }

import { NextRequest, NextResponse } from "next/server";
import { uploadFileToBucket } from "@/lib/useBuckets";

export async function POST(req: NextRequest) {
  console.log("test");
  try {
    const data = await req.formData();

    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generates a unique filename while preserving the extension.
    const extension = file.name.split(".").pop();
    const filename = `${crypto.randomUUID()}.${extension}`;

    const uploaded = await uploadFileToBucket({
      bucket: process.env.S3_BUCKET!,
      key: filename,
      body: buffer,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      fileName: filename,
      url: uploaded.url,
      bucket: uploaded.bucket,
      key: uploaded.key,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
      },
      { status: 500 },
    );
  }
}
