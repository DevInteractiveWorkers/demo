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
import DashboardDisplay from "./dashboard-display";

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
    <>
      <DashboardDisplay
        title="Candidates"
        data={filteredCandidates}
        loading={loading}
        onSearch={setSearch}
        onCreate={() => setIsOpen(true)}
        onEdit={setEditingCandidate}
        extraFilters={
          <DateFilter
            date={date}
            setDate={setDate}
            format={format}
            setFormat={setFormat}
          />
        }
        renderGrid={(data, onEdit) => (
          <CandidateGridRender data={data} onEdit={onEdit} />
        )}
        renderTable={(data, onEdit) => (
          <CandidatesTableRender data={data} onRowSelect={onEdit} />
        )}
      />
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
    </>
  );
}
