import { NextResponse } from "next/server";
import { getCandidatesByPosition } from "@/lib/firestore";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ position: string }> },
) {
  const { position } = await params;

  const candidates = await getCandidatesByPosition(position);

  if (!candidates.length) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(
    new URL(`/${position}/${candidates[0].id}`, req.url),
  );
}
