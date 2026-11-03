"use client";

import { useEffect, useMemo, useState } from "react";
import { getCandidates } from "@/lib/firestore";
import { LoadingPage } from "@/components/loading";
import DashboardDisplay from "./dashboard-display";
import DateFilter from "./date-filter";
import CandidateGridRender from "./data-render/candidates-grid";
import CandidatesTableRender from "./data-render/candidates-table";
import { FormatType } from "../input/date";
import { useFormatDate } from "@/lib/useFormatDate";
import { usePathname, useRouter } from "next/navigation";

export default function Candidates() {
  const router = useRouter();
  const path = usePathname();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

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
      setCandidates(await getCandidates());
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

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <DashboardDisplay
        title="candidates"
        data={filteredCandidates}
        loading={loading}
        onSearch={setSearch}
        onCreate={() => router.push(`${path}/create`)}
        extraFilters={
          <DateFilter
            date={date}
            setDate={setDate}
            format={format}
            setFormat={setFormat}
          />
        }
        renderGrid={(data) => <CandidateGridRender data={data} />}
        renderTable={(data) => (
          <CandidatesTableRender
            data={data}
            onRowSelect={(e) => router.push(`${path}/edit?c=${e.id}`)}
          />
        )}
      />
    </>
  );
}
