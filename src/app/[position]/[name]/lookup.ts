import { cache } from "react";

import { getCandidate, getPosition } from "@/lib/firestore";

export const SITE_URL = "https://demo.interactiveworkers.com";
export const SITE_NAME = "InteractiveWorkers";

export const candidateTitle = (c: { name: string; lastName: string }) =>
  `${c.name} ${c.lastName} from ${SITE_NAME}`;

// Shared by generateMetadata and the page: cache() dedupes the lookup within
// a request, so both together still cost two document reads. Returns null for
// every case the page renders NotFound for.
export const getCandidatePage = cache(
  async (positionId: string, candidateId: string) => {
    // Both reads run in parallel; the candidate lookup reuses the position
    // instead of re-reading it.
    const positionPromise = getPosition(positionId);
    const [position, candidate] = await Promise.all([
      positionPromise,
      getCandidate(candidateId, positionPromise),
    ]);

    if (!position || !candidate) return null;

    // The candidate must belong to the position in the URL.
    if (candidate.position?.id !== position.id) return null;

    return { position, candidate };
  },
);
