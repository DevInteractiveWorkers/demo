import Link from "next/link";

import { getPosition, getCandidatesByPosition } from "@/lib/firestore";

export default async function PositionPage({
  params,
}: {
  params: Promise<{ position: string }>;
}) {
  const { position } = await params;

  const positionData = (await getPosition(position)) as {
    id: string;
    name: string;
    description: string;
  };

  if (!positionData) {
    return <h1>Position not found</h1>;
  }

  const candidates = await getCandidatesByPosition(position);

  return (
    <main className="p-12">
      <h1 className="text-5xl font-medium">{positionData.name}</h1>

      <p className="opacity-60 mt-2">{positionData.description}</p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {candidates.map((candidate) => (
          <Link
            key={candidate.id}
            href={`/${position}/${candidate.id}`}
            className="border border-[#292929] rounded-xl p-6"
          >
            <h2 className="text-xl">
              {candidate.name} {candidate.lastName}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
