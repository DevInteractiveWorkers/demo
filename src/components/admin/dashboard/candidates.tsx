"use client";

import { useEffect, useState } from "react";
import { getCandidates } from "@/lib/firestore";
import { IconButton } from "@/components/icons/icon-button";
import SearchInput from "../search";
import CreateCandidate from "../create-candidate";
import { useFormatDate } from "@/lib/useFormatDate";
import DataTable from "../data/data-table";
import EditCandidate from "../data/edit-candidate";
import { handleShare } from "@/lib/useShare";
import { Card } from "./card";
import SelectGrid, { GridViewOptions } from "./select-grid";
import { LoadingPage } from "@/components/loading";
import { Icon } from "@/components/icons/icon";
import DateFilter from "./date-filter";
import { FormatType } from "../input/date";
import Tag from "@/components/tag";

export default function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [view, setView] = useState<GridViewOptions>("grid-large");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [editingCandidate, setEditingCandidate] = useState<any>(null);

  const [date, setDate] = useState(new Date());

  const [format, setFormat] = useState<{
    name: string;
    value: FormatType;
  }>({
    name: "Year View",
    value: "year",
  });

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
    const query = search.toLowerCase();

    const matchesSearch =
      !query ||
      candidate.name?.toLowerCase().includes(query) ||
      candidate.lastName?.toLowerCase().includes(query) ||
      candidate.position?.name?.toLowerCase().includes(query);

    const candidateDate = useFormatDate(candidate.createdAt, format.value);
    const selectedDate = useFormatDate(date, format.value);

    const matchesDate = candidateDate === selectedDate;

    return matchesSearch && matchesDate;
  });

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <section id="candidates" className="flex flex-col h-screen space-y-6 ">
      {" "}
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
      <div className="flex justify-between items-center gap-2">
        <p className="opacity-60 max-md:hidden">
          {filteredCandidates.length} candidates
        </p>

        <div className="md:w-min">
          <DateFilter
            date={date}
            setDate={setDate}
            format={format}
            setFormat={setFormat}
          />
        </div>
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
      {filteredCandidates.length > 0 ? (
        <>
          {view.includes("grid") ? (
            <div
              className={`flex-1 overflow-y-auto grid ${
                view === "grid-small"
                  ? "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
              } gap-4`}
            >
              {filteredCandidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  item={{
                    ...candidate,
                    name: `${candidate.name} ${candidate.lastName}`,
                    description: candidate.position.name,
                    tag: (
                      <Tag
                        title={candidate.resumeUrl ? "Resume" : "No Resume"}
                        color={candidate.resumeUrl ? "green-500" : "red-500"}
                      >
                        <Icon
                          icon="file-pdf"
                          width="20px"
                          height="20px"
                          filled
                          stroke={0}
                        />
                      </Tag>
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
                  sortValue: (c) => c.position?.name,
                },
                {
                  key: "resume",
                  label: "Resume",
                  render: (c) => (
                    <Tag
                      title={c.resumeUrl ? "Resume" : "No Resume"}
                      color={c.resumeUrl ? "green-500" : "red-500"}
                    />
                  ),
                },
                {
                  key: "video",
                  label: "Video",
                  render: (c) => (
                    <Tag
                      title={c.videoUrl ? "Video" : "No Video"}
                      color={c.videoUrl ? "green-500" : "red-500"}
                    />
                  ),
                },
                {
                  key: "createdAt",
                  label: "Created",
                  render: (c) => useFormatDate(c.createdAt, "long"),
                  sortValue: (c) => useFormatDate(c.createdAt, "long"),
                },
                {
                  key: "updatedAt",
                  label: "Updated",
                  render: (c) => useFormatDate(c.lastUpdatedAt, "long"),
                  sortValue: (c) => useFormatDate(c.lastUpdatedAt, "long"),
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
                  sortAllowed: false,
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
        </>
      ) : (
        <span>No data found.</span>
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
