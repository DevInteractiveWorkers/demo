import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.formData();

  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ghlForm = new FormData();

  ghlForm.append("file", file);

  const response = await fetch(
    "https://services.leadconnectorhq.com/medias/upload-file",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GHL_TOKEN}`,
        Version: "2021-07-28",
      },
      body: ghlForm,
    },
  );

  const result = await response.json();

  return NextResponse.json(result);
}
