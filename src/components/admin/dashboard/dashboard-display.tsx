"use client";

import SearchInput from "../search";
import SelectGrid, { GridViewOptions } from "./select-grid";
import { IconButton } from "@/components/icons/icon-button";
import { LoadingPage } from "@/components/loading";
import { useGridView } from "@/lib/useLocalStorage";
import { ReactNode, useState } from "react";

type DashboardDisplayProps<T> = {
  title: string;
  data: T[];
  loading: boolean;

  extraFilters?: ReactNode;

  renderGrid: (data: T[], onEdit: (item: T) => void) => ReactNode;

  renderTable: (data: T[], onEdit: (item: T) => void) => ReactNode;

  onSearch: (query: string) => void;

  onCreate: () => void;

  onEdit: (item: T) => void;
};

export default function DashboardDisplay<T>({
  title,
  data,
  loading,
  extraFilters,
  renderGrid,
  renderTable,
  onSearch,
  onCreate,
  onEdit,
}: DashboardDisplayProps<T>) {
  const [search, setSearch] = useState("");
  const { view, setView } = useGridView();

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch(value);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <section
      id={title.toLowerCase()}
      className="flex flex-col h-screen space-y-6"
    >
      <div
        id="search"
        className="flex max-md:flex-col justify-between md:items-center items-end gap-2"
      >
        <SearchInput value={search} onChange={handleSearch} />
      </div>

      <div id="filters" className="flex justify-between items-center gap-2">
        {extraFilters}

        <IconButton
          id={`add-${title.toLowerCase()}`}
          filled
          icon="plus"
          stroke={0}
          reversed
          width="20px"
          height="20px"
          viewBox="0 0 17 17"
          className="bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200"
          onClick={onCreate}
        />
      </div>

      <div id="view-filter" className="flex justify-between items-center gap-2">
        <p className="opacity-60 text-xs">
          {data.length} {title.toLowerCase()}
        </p>
        <SelectGrid
          selected={view}
          onSelect={(option) => setView(option.value as GridViewOptions)}
        />
      </div>
      {view !== "list" ? (
        <div
          id={`${title}-grid`}
          className={`flex-1 overflow-y-auto grid ${
            view === "grid-small"
              ? "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
          } gap-4`}
        >
          {renderGrid(data, onEdit)}
        </div>
      ) : (
        renderTable(data, onEdit)
      )}
    </section>
  );
}
