"use client";

import { useEffect, useMemo, useState } from "react";
import { getCandidates } from "@/lib/firestore";
import { LoadingPage } from "@/components/loading";

import CreateCandidate from "../create-candidate";
import EditCandidate from "../data/edit-candidate";
import DashboardDisplay from "./dashboard-display";
import DateFilter from "./date-filter";
import CandidateGridRender from "./data-render/candidates-grid";
import CandidatesTableRender from "./data-render/candidates-table";

import { DateMode } from "../input/calendar-input";
import { dateMatches } from "@/lib/dateMatches";

export default function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<DateMode>("year");

  useEffect(() => {
    const next = new Date(date);

    switch (mode) {
      case "week":
        next.setDate(next.getDate() - ((next.getDay() + 6) % 7));
        break;

      case "month":
        next.setDate(1);
        break;

      case "year":
        next.setMonth(0, 1);
        break;

      case "date":
      case "range":
      default:
        return;
    }

    if (next.getTime() !== date.getTime()) {
      setDate(next);
    }
  }, [mode]);

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

      return matchesSearch && dateMatches(candidate.createdAt, date, mode);
    });
  }, [candidates, search, date, mode]);

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
            mode={mode}
            setMode={() =>
              setMode((prev) => (prev === "week" ? "month" : "week"))
            }
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
