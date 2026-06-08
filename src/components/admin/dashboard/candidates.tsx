"use client";

import { useEffect, useState } from "react";
import { getCandidates } from "@/lib/firestore";
import { IconButton } from "@/components/icons/icon-button";
import SearchInput from "../search";
import { Icon } from "@/components/icons/icon";
import Button from "../button";
import CreateCandidate from "../create-candidate";

export default function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    getCandidates()
      .then(setCandidates)
      .finally(() => setLoading(false));
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    const query = search.toLowerCase();

    return (
      candidate.name?.toLowerCase().includes(query) ||
      candidate.lastName?.toLowerCase().includes(query) ||
      candidate.position?.name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <section id="candidates">Loading...</section>;
  }

  return (
    <section id="candidates" className="space-y-6">
      <div className="flex justify-between items-center">
        <SearchInput value={search} onChange={setSearch} />

        <div
          className="flex gap-2"
          title={`Change view to ${view === "list" ? "grid" : "list"}`}
        >
          <IconButton
            height="40px"
            width="40px"
            icon={view === "list" ? "grid" : "list"}
            filled={view === "list"}
            stroke={view === "list" ? 0 : 1.5}
            onClick={() => {
              if (view === "grid") setView("list");
              if (view === "list") setView("grid");
            }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="opacity-60">{filteredCandidates.length} candidates</p>

        <IconButton
          filled
          icon="plus"
          stroke={0}
          className="bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200"
          reversed
          width="20px"
          height="20px"
          viewBox="0 0 17 17"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Add Candidate
        </IconButton>
      </div>

      {view === "grid" ? (
        <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : (
        <div className="border border-[#292929] rounded-xl overflow-hidden">
          {filteredCandidates.map((candidate) => (
            <CandidateRow key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
      <CreateCandidate
        isOpen={isOpen}
        toggleClose={() => {
          setIsOpen(false);
        }}
      />
    </section>
  );
}

function CandidateCard({ candidate }: { candidate: any }) {
  return (
    <div className="border border-[#292929] rounded-xl overflow-hidden">
      <div className="aspect-square bg-[#202020]">
        {candidate.videoUrl ? (
          <video
            src={candidate.videoUrl}
            className="h-full object-cover opacity-50 mask-linear-180 mask-linear-from-black"
          />
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-full opacity-25">
            <Icon icon="image" filled stroke={0} />
            No Video Found
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium">
          {candidate.name} {candidate.lastName}
        </h3>

        <p className="text-sm opacity-60">{candidate.position?.name}</p>
      </div>
    </div>
  );
}

function CandidateRow({ candidate }: { candidate: any }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_auto] gap-4 p-4 border-b border-[#292929]">
      <div>
        {candidate.name} {candidate.lastName}
      </div>

      <div className="opacity-60">{candidate.position?.name}</div>

      <div className="flex gap-4">
        {candidate.resumeUrl && (
          <a href={candidate.resumeUrl} target="_blank" rel="noreferrer">
            Resume
          </a>
        )}

        {candidate.videoUrl && (
          <a href={candidate.videoUrl} target="_blank" rel="noreferrer">
            Video
          </a>
        )}
      </div>
    </div>
  );
}
