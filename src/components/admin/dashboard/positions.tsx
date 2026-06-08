"use client";

import { useEffect, useState } from "react";
import { getPositions } from "@/lib/firestore";

import SearchInput from "../search";
import { IconButton } from "@/components/icons/icon-button";
import { Icon } from "@/components/icons/icon";

import CreatePosition from "../create-position";
import DataTable from "../data-table";
import { useFormatDate } from "@/lib/useFormatDate";

export default function Positions() {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isOpen, setIsOpen] = useState(false);

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
    return <section id="positions">Loading...</section>;
  }

  return (
    <section id="positions" className="space-y-6">
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
              setView((prev) => (prev === "grid" ? "list" : "grid"));
            }}
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

      {view === "grid" ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPositions.map((position) => (
            <PositionCard key={position.id} position={position} />
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
            },
            {
              key: "active",
              label: "Status",
              render: (p) => (p.active ? "Active" : "Inactive"),
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
        />
      )}

      <CreatePosition isOpen={isOpen} toggleClose={() => setIsOpen(false)} />
    </section>
  );
}

function PositionCard({ position }: { position: any }) {
  return (
    <div className="border border-[#292929] rounded-xl overflow-hidden">
      <div className="aspect-video bg-[#202020] flex flex-col justify-center items-center opacity-50">
        <Icon icon="briefcase" filled stroke={0} width="48" height="48" />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-medium">{position.name}</h3>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              position.active
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {position.active ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="text-sm opacity-60 mt-2 line-clamp-3">
          {position.description}
        </p>
      </div>
    </div>
  );
}
