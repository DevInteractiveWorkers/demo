import { NextRequest, NextResponse } from "next/server";
import { uploadFileToBucket } from "@/lib/useBuckets";

export async function POST(req: NextRequest) {
  try {
    const file = (await req.formData()).get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploaded = await uploadFileToBucket(file);

    return NextResponse.json({
      success: true,
      ...uploaded,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
