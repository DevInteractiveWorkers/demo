import { NextResponse } from "next/server";
import { createUploadUrl } from "@/lib/useBuckets";

export async function POST(req: Request) {
  const { filename, contentType } = await req.json();

  const result = await createUploadUrl(filename, contentType);

  return NextResponse.json(result);
}
