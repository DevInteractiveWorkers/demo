import { getCandidate, getPosition } from "@/lib/firestore";

import CandidatePageClient from "./CandidatePageClient";

export default async function Page({
  params,
}: {
  params: Promise<{
    position: string;
    name: string;
  }>;
}) {
  const { position, name } = await params;

  const [positionData, candidateData] = await Promise.all([
    getPosition(position),
    getCandidate(name),
  ]);

  if (!positionData || !candidateData) {
    return (
      <main className="flex items-center justify-center h-dvh">
        <h1 className="text-2xl font-medium">Not found</h1>
      </main>
    );
  }

  return (
    <CandidatePageClient
      candidate={JSON.parse(JSON.stringify(candidateData))}
      position={JSON.parse(JSON.stringify(positionData))}
    />
  );
}
