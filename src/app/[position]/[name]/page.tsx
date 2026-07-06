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

  const [positionData, candidateData, candidates] = await Promise.all([
    getPosition(position),
    getCandidate(name),
    getCandidatesByPosition(position),
  ]);

  if (!positionData || !candidateData) {
    return <NotFound />;
  }

  const belongsToPosition = candidates.some(
    (candidate) => candidate.id === candidateData.id,
  );

  if (!belongsToPosition) {
    return <NotFound />;
  }

  return (
    <CandidatePageClient
      candidate={JSON.parse(JSON.stringify(candidateData))}
      position={JSON.parse(JSON.stringify(positionData))}
      seeMore={candidates.length > 1}
    />
  );
}
