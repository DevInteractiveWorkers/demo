import { NextResponse } from "next/server";
import { getFirstCandidateId } from "@/lib/firestore";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ position: string }> },
) {
  const { position } = await params;

  const firstCandidateId = await getFirstCandidateId(position);

  if (!firstCandidateId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(
    new URL(`/${position}/${firstCandidateId}`, req.url),
  );
}
