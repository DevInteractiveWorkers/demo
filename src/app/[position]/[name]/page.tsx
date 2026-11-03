import { getCandidate, getPosition } from "@/lib/firestore";

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

  // Both reads run in parallel; the candidate lookup reuses the position
  // instead of re-reading it, so a valid page costs two document reads.
  const positionPromise = getPosition(position);
  const [positionData, candidateData] = await Promise.all([
    positionPromise,
    getCandidate(name, positionPromise),
  ]);

  if (!positionData || !candidateData) {
    return <NotFound />;
  }

  // The candidate must belong to the position in the URL.
  if (candidateData.position?.id !== positionData.id) {
    return <NotFound />;
  }

  return (
    <CandidatePageClient
      candidate={JSON.parse(JSON.stringify(candidateData))}
      position={JSON.parse(JSON.stringify(positionData))}
    />
  );
}
