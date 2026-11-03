import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { buildObjectKey, getPublicUrl, s3 } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const fileName = body?.fileName;
    const contentType = body?.contentType;

    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 },
      );
    }

    if (!contentType || typeof contentType !== "string") {
      return NextResponse.json(
        { error: "contentType is required" },
        { status: 400 },
      );
    }

    const key = buildObjectKey(fileName);

    const bucket = process.env.S3_BUCKET!;

    let uploadUrl: string;

    try {
      uploadUrl = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: contentType,
        }),
        { expiresIn: 60 * 10 }, // 10 minutes
      );
    } catch (signError) {
      console.error("Failed to generate presigned URL:", signError);
      return NextResponse.json(
        { error: "Could not generate upload URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
      bucket,
      fileName: key,
      url: getPublicUrl(key),
    });
  } catch (error) {
    console.error("UPLOAD-URL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
