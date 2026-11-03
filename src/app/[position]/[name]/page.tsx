import type { Metadata } from "next";

import CandidatePageClient from "./CandidatePageClient";
import NotFound from "@/app/not-found";
import {
  SITE_NAME,
  SITE_URL,
  candidateTitle,
  getCandidatePage,
} from "./lookup";

type Params = {
  params: Promise<{
    position: string;
    name: string;
  }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { position, name } = await params;
  const data = await getCandidatePage(position, name);

  // Same cases the page renders NotFound for: keep the layout's defaults and
  // keep the page out of search results.
  if (!data) return { robots: { index: false } };

  const title = candidateTitle(data.candidate);
  const url = `${SITE_URL}/${data.position.id}/${data.candidate.id}`;

  return {
    title,
    alternates: { canonical: url },
    openGraph: { type: "website", title, url, siteName: SITE_NAME },
    twitter: { card: "summary", title },
  };
}

export default async function Page({ params }: Params) {
  const { position, name } = await params;
  const data = await getCandidatePage(position, name);

  if (!data) {
    return <NotFound />;
  }

  return (
    <CandidatePageClient
      candidate={JSON.parse(JSON.stringify(data.candidate))}
      position={JSON.parse(JSON.stringify(data.position))}
    />
  );
}
