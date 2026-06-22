"use client";

import { useEffect, useMemo, useState } from "react";
import { getCandidates } from "@/lib/firestore";
import { IconButton } from "@/components/icons/icon-button";
import SearchInput from "../search";
import CreateCandidate from "../create-candidate";
import { useFormatDate } from "@/lib/useFormatDate";
import EditCandidate from "../data/edit-candidate";
import SelectGrid, { GridViewOptions } from "./select-grid";
import { LoadingPage } from "@/components/loading";
import DateFilter from "./date-filter";
import { FormatType } from "../input/date";
import CandidatesTableRender from "./data-render/candidates-table";
import CandidateGridRender from "./data-render/candidates-grid";

export default function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [view, setView] = useState<GridViewOptions>("grid-large");

  const [isOpen, setIsOpen] = useState(false);
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
      const { candidates } = await getCandidates();
      setCandidates(candidates);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    const query = search.toLowerCase();

    return candidates.filter((candidate) => {
      const matchesSearch =
        !query ||
        candidate.name?.toLowerCase().includes(query) ||
        candidate.lastName?.toLowerCase().includes(query) ||
        candidate.position?.name?.toLowerCase().includes(query);

      const candidateDate = useFormatDate(candidate.createdAt, format.value);

      const selectedDate = useFormatDate(date, format.value);

      return matchesSearch && candidateDate === selectedDate;
    });
  }, [candidates, search, date, format.value]);

  const toggleCreateCandidate = () => {
    setIsOpen((prev) => !prev);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <section id="candidates" className="flex flex-col h-screen space-y-6">
      <div className="flex max-md:flex-col justify-between md:items-center items-end gap-2">
        <SearchInput value={search} onChange={setSearch} />

        <div
          className="flex gap-2"
          title={`Change view to ${view === "list" ? "grid" : "list"}`}
        ></div>
      </div>

      <div className="flex justify-between items-center gap-2">
        <SelectGrid
          selected={view}
          onSelect={(option) => setView(option.value as GridViewOptions)}
        />
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
          reversed
          width="20px"
          height="20px"
          viewBox="0 0 17 17"
          className="bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200"
          onClick={toggleCreateCandidate}
        />
      </div>

      {filteredCandidates.length > 0 ? (
        view !== "list" ? (
          <>
            <p className="opacity-60 max-xl:hidden text-xs">
              {filteredCandidates.length}{" "}
              <span className="max-lg:hidden">candidates</span>
            </p>
            <div
              className={`flex-1 overflow-y-auto grid ${
                view === "grid-small"
                  ? "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
              } gap-4`}
            >
              <CandidateGridRender
                data={filteredCandidates}
                onEdit={setEditingCandidate}
              />
            </div>
          </>
        ) : (
          <CandidatesTableRender
            data={filteredCandidates}
            onRowSelect={setEditingCandidate}
          />
        )
      ) : (
        <span>No data found.</span>
      )}

      <CreateCandidate isOpen={isOpen} toggleClose={() => setIsOpen(false)} />

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
