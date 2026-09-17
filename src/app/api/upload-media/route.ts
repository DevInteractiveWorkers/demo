import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use /api/upload-url instead." },
    { status: 410 },
  );
}
