import Link from "next/link";
import { getPosition, getCandidatesByPosition } from "@/lib/firestore";
import { Card } from "@/components/admin/dashboard/card";
import JumpToButton from "@/components/jump-to";
import Image from "next/image";
import NotFound from "../not-found";

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
    return <NotFound />;
  }

  const candidates = await getCandidatesByPosition(position);

  return (
    <main className="md:p-12 p-4">
      <header className="border-b pb-4 mb-4 border-white/10">
        <Image
          src="/logo/01_Primary_Logo/Primary_Logo-04.png"
          width={1080}
          height={1080}
          className="w-50"
          alt="InteractiveWorkers"
        />
      </header>
      <h1 className="md:text-5xl text-4xl font-medium">{positionData.name}</h1>

      <p className="opacity-60 mt-2 md:w-1/2 max-md:text-sm text-justify">
        {positionData.description}
      </p>

      <div className="md:overflow-visible overflow-x-auto overflow-y-hidden no-scrollbar">
        <div
          className="
            flex md:grid md:grid-cols-3
            gap-6 mt-10
            md:w-auto
            w-max
            snap-x snap-mandatory
          "
        >
          {candidates.map((candidate, index) => {
            const nextCandidate = candidates[(index + 1) % candidates.length];
            console.log(candidates.length, index);

            return (
              <div
                key={candidate.id}
                id={candidate.id}
                className="
                  shrink-0
                  max-w-[95vw] md:w-auto
                  snap-center
                  group/item
                "
              >
                <Link
                  href={`/${position}/${candidate.id}`}
                  className="
                    block
                    cursor-pointer
                    transition-all
                    duration-150
                    group-hover/item:scale-95
                  "
                >
                  <Card
                    item={{
                      ...candidate,
                      name: `${candidate.name} ${candidate.lastName}`,
                    }}
                  />
                </Link>
                {candidates.length > 1 && (
                  <div className="md:hidden">
                    <JumpToButton
                      direction={
                        index + 1 === candidates.length ? "left" : "right"
                      }
                      position="relative"
                      href={`#${nextCandidate.id}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
