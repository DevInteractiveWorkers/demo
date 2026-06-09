"use client";

import { useEffect, useState } from "react";
import { getCandidates } from "@/lib/firestore";
import { IconButton } from "@/components/icons/icon-button";
import SearchInput from "../search";
import { Icon } from "@/components/icons/icon";
import CreateCandidate from "../create-candidate";
import { useFormatDate } from "@/lib/useFormatDate";
import DataTable from "../data/data-table";
import EditCandidate from "../data/edit-candidate";
import { handleShare } from "@/lib/useShare";

export default function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [editingCandidate, setEditingCandidate] = useState<any>(null);

  const loadCandidates = async () => {
    setLoading(true);

    try {
      const data = await getCandidates();
      setCandidates(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  useEffect(() => {
    getCandidates()
      .then(setCandidates)
      .finally(() => setLoading(false));
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    if (monthFilter === "all") return true;

    const query = search.toLowerCase();

    return (
      useFormatDate(candidate.createdAt, "month") === monthFilter ||
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
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onEdit={() => setEditingCandidate(candidate)}
            />
          ))}
        </div>
      ) : (
        <DataTable
          data={filteredCandidates}
          columns={[
            {
              key: "name",
              label: "Name",
              render: (c) => `${c.name} ${c.lastName}`,
            },
            {
              key: "position",
              label: "Position",
              render: (c) => c.position?.name,
            },
            {
              key: "resume",
              label: "Resume",
              render: (c) =>
                c.resumeUrl ? (
                  <a href={c.resumeUrl}>Resume</a>
                ) : (
                  <i>No Resume</i>
                ),
            },
            {
              key: "video",
              label: "Video",
              render: (c) =>
                c.videoUrl ? <a href={c.videoUrl}>Video</a> : <i>No Video</i>,
            },
            {
              key: "createdAt",
              label: "Created",
              render: (c) => useFormatDate(c.createdAt, "long"),
            },
            {
              key: "updatedAt",
              label: "Updated",
              render: (c) => useFormatDate(c.lastUpdatedAt, "month-year"),
            },
            {
              key: "",
              label: "Demo",
              render: (c) => (
                <IconButton
                  icon="share"
                  width="50px"
                  height="30px"
                  stroke={0}
                  filled
                  onClick={() =>
                    handleShare({
                      url: `https://demo.interactiveworkers.com/${c.position.id}/${c.id}`,
                      title: `${c.name} ${c.lastName} from InteractiveWorkers`,
                    })
                  }
                />
              ),
            },
          ]}
          footer={
            <>
              <span className="opacity-50">Total Candidates:</span>{" "}
              {filteredCandidates.length}
            </>
          }
          onRowSelect={(candidate) => {
            setEditingCandidate(candidate);
          }}
        />
      )}
      <CreateCandidate
        isOpen={isOpen}
        toggleClose={() => {
          setIsOpen(false);
        }}
      />
      {editingCandidate && (
        <EditCandidate
          candidate={editingCandidate}
          isOpen
          toggleClose={() => {
            setEditingCandidate(null);
            loadCandidates();
          }}
          onUpdated={loadCandidates}
        />
      )}
    </section>
  );
}
function CandidateCard({
  candidate,
  onEdit,
}: {
  candidate: any;
  onEdit: () => void;
}) {
  return (
    <div className="border border-[#292929] rounded-xl overflow-hidden relative group/card">
      <div className="absolute top-0 right-0 z-10 pt-4 group-hover/card:opacity-100 opacity-0 transition-all duration-200 flex">
        <IconButton
          icon="share"
          width="50px"
          height="30px"
          stroke={0}
          filled
          onClick={() =>
            handleShare({
              url: `https://demo.interactiveworkers.com/${candidate.position.id}/${candidate.id}`,
              title: `${candidate.name} ${candidate.lastName} from InteractiveWorkers`,
            })
          }
        />
        <IconButton
          icon="dots-vertical"
          width="50px"
          height="30px"
          stroke={3}
          onClick={onEdit}
        />
      </div>

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
