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
import { Card } from "./card";
import SelectGrid, { GridViewOptions } from "./select-grid";
import { types } from "util";
import { type } from "os";

export default function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [view, setView] = useState<GridViewOptions>("grid-large");
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
          <SelectGrid
            selected={view}
            onSelect={(option) => setView(option.value as GridViewOptions)}
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

      {view.includes("grid") ? (
        <div
          className={`grid ${
            view === "grid-small"
              ? "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4"
          }`}
        >
          {filteredCandidates.map((candidate) => (
            <Card
              key={candidate.id}
              item={{
                ...candidate,
                name: `${candidate.name} ${candidate.lastName}`,
                description: candidate.position.name,
                tag: (
                  <span
                    className={`text-xs px-2 py-1 rounded-full text-center ${
                      candidate.resumeUrl
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {candidate.resumeUrl ? "Resume" : "No Resume"}
                  </span>
                ),
              }}
              onEdit={() => setEditingCandidate(candidate)}
              onShare={() =>
                handleShare({
                  url: `https://demo.interactiveworkers.com/${candidate.position.id}/${candidate.id}`,
                  title: `${candidate.name} ${candidate.lastName} from InteractiveWorkers`,
                })
              }
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
