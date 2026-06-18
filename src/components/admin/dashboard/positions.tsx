"use client";

import { useEffect, useState } from "react";
import { getPositions } from "@/lib/firestore";
import SearchInput from "../search";
import { IconButton } from "@/components/icons/icon-button";
import CreatePosition from "../create-position";
import DataTable from "../data/data-table";
import { useFormatDate } from "@/lib/useFormatDate";
import EditPosition from "../data/edit-position";
import { Card } from "./card";
import SelectGrid, { GridViewOptions } from "./select-grid";
import { LoadingPage } from "@/components/loading";

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
    <section id="positions" className="space-y-6">
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
        <p className="opacity-60">{filteredPositions.length} positions</p>

        <IconButton
          filled
          icon="plus"
          stroke={0}
          className="bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200"
          reversed
          width="20px"
          height="20px"
          viewBox="0 0 17 17"
          onClick={() => setIsOpen(true)}
        >
          Add Position
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
          {filteredPositions.map((position) => (
            <Card
              key={position.id}
              item={{
                ...position,
                description:
                  position.description !== ""
                    ? position.description
                    : "No description available",
                tag: (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      position.active
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {position.active ? "Active" : "Inactive"}
                  </span>
                ),
              }}
              onEdit={() => setEditingPosition(position)}
            />
          ))}
        </div>
      ) : (
        <DataTable
          data={filteredPositions}
          columns={[
            {
              key: "name",
              label: "Position",
            },
            {
              key: "description",
              label: "Description",
              render: (p) => <p className="line-clamp-2">{p.description}</p>,
            },
            {
              key: "active",
              label: "Status",
              render: (p) => (
                <span className={p.active ? "text-green-500" : "text-red-500"}>
                  {p.active ? "Active" : "Inactive"}
                </span>
              ),
            },
            {
              key: "createdAt",
              label: "Created",
              render: (p) => useFormatDate(p.createdAt, "long"),
            },
          ]}
          footer={
            <>
              <span className="opacity-50">Total Positions:</span>{" "}
              {filteredPositions.length}
            </>
          }
          onRowSelect={(position) => {
            setEditingPosition(position);
          }}
        />
      )}
      <CreatePosition
        isOpen={isOpen}
        toggleClose={() => {
          setIsOpen(false);
          loadPositions();
        }}
      />{" "}
      {editingPosition && (
        <EditPosition
          position={editingPosition}
          isOpen
          toggleClose={() => {
            setEditingPosition(null);
            loadPositions();
          }}
          onUpdated={loadPositions}
        />
      )}
    </section>
  );
}
