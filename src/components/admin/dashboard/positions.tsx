"use client";

import { useEffect, useState } from "react";
import { getPositions } from "@/lib/firestore";
import CreatePosition from "../create-position";
import EditPosition from "../data/edit-position";
import { GridViewOptions } from "./select-grid";
import { LoadingPage } from "@/components/loading";
import PositionsGridRender from "./data-render/positions-grid";
import PositionsTableRender from "./data-render/positions-table";
import DashboardDisplay from "./dashboard-display";
import { usePathname, useRouter } from "next/navigation";

export default function Positions() {
  const router = useRouter();
  const path = usePathname();
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const loadPositions = async () => {
    setLoading(true);

    try {
      const data = await getPositions();
      setPositions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPositions();
  }, []);

  useEffect(() => {
    getPositions()
      .then(setPositions)
      .finally(() => setLoading(false));
  }, []);

  const filteredPositions = positions.filter((position) => {
    const query = search.toLowerCase();

    return (
      position.name?.toLowerCase().includes(query) ||
      position.description?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <DashboardDisplay
        title="Positions"
        data={filteredPositions}
        loading={loading}
        onSearch={setSearch}
        onCreate={() => router.push(`${path}/create`)}
        renderGrid={(data) => <PositionsGridRender data={data} />}
        renderTable={(data) => (
          <PositionsTableRender
            data={data}
            onRowSelect={(e) => router.push(`${path}/edit?c=${e.id}`)}
          />
        )}
      />
    </>
  );
}
