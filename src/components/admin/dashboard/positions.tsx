"use client";

import { useEffect, useState } from "react";
import { getPositions } from "@/lib/firestore";
import SearchInput from "../search";
import { IconButton } from "@/components/icons/icon-button";
import CreatePosition from "../create-position";
import EditPosition from "../data/edit-position";
import SelectGrid, { GridViewOptions } from "./select-grid";
import { LoadingPage } from "@/components/loading";
import PositionsGridRender from "./data-render/positions-grid";
import PositionsTableRender from "./data-render/positions-table";
import DateFilter from "./date-filter";
import DashboardDisplay from "./dashboard-display";

export default function Positions() {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [view, setView] = useState<GridViewOptions>("grid-large");
  const [isOpen, setIsOpen] = useState(false);

  const [editingPosition, setEditingPosition] = useState<any>(null);

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
        onCreate={() => setIsOpen(true)}
        onEdit={setEditingPosition}
        renderGrid={(data, onEdit) => (
          <PositionsGridRender data={data} onEdit={onEdit} />
        )}
        renderTable={(data, onEdit) => (
          <PositionsTableRender data={data} onRowSelect={onEdit} />
        )}
      />

      <CreatePosition isOpen={isOpen} toggleClose={() => setIsOpen(false)} />

      {editingPosition && (
        <EditPosition
          position={editingPosition}
          isOpen
          toggleClose={() => {
            setEditingPosition(null);
          }}
          onUpdated={loadPositions}
        />
      )}
    </>
  );
}
