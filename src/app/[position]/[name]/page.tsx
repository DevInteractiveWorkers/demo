import {
  getCandidate,
  getCandidatesByPosition,
  getPosition,
} from "@/lib/firestore";

import CandidatePageClient from "./CandidatePageClient";
import NotFound from "@/app/not-found";

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
    return <NotFound />;
  }

  const candidates = await getCandidatesByPosition(position);

  return (
    <CandidatePageClient
      candidate={JSON.parse(JSON.stringify(candidateData))}
      position={JSON.parse(JSON.stringify(positionData))}
      seeMore={candidates.length > 1}
    />
  );
}
