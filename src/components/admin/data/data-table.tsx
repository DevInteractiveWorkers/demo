"use client";

import { useMemo, useState } from "react";
import { IconButton } from "../../icons/icon-button";

type Column<T> = {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortValue?: (item: T) => any;
  sortAllowed?: boolean;
};

type DataTableProps<T> = {
  name?: string;
  data: T[];
  columns: Column<T>[];
  footer?: React.ReactNode;
  onRowSelect?: (row: T) => void;
};

type SortConfig = {
  key: string | null;
  direction: "asc" | "desc" | null;
};

export default function DataTable<T>({
  name,
  data,
  columns,
  footer,
  onRowSelect,
}: DataTableProps<T>) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      // New column -> ASC
      if (prev.key !== key) {
        return {
          key,
          direction: "asc",
        };
      }

      // ASC -> DESC
      if (prev.direction === "asc") {
        return {
          key,
          direction: "desc",
        };
      }

      // DESC -> RESET
      return {
        key: null,
        direction: null,
      };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    const activeColumn = columns.find((c) => c.key === sortConfig.key);

    const directionMultiplier = sortConfig.direction === "asc" ? 1 : -1;

    return [...data].sort((a: any, b: any) => {
      const aValue = activeColumn?.sortValue
        ? activeColumn.sortValue(a)
        : a[sortConfig.key!];

      const bValue = activeColumn?.sortValue
        ? activeColumn.sortValue(b)
        : b[sortConfig.key!];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const result = String(aValue).localeCompare(String(bValue), undefined, {
        numeric: true,
        sensitivity: "base",
      });

      return result * directionMultiplier;
    });
  }, [data, sortConfig, columns]);

  return (
    <div
      id={name ? `${name}-table` : "table"}
      className="border border-[#292929] rounded-xl overflow-hidden flex flex-col h-full"
    >
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((column) => {
                const isActive = sortConfig.key === column.key;

                return (
                  <th
                    key={column.key}
                    className="bg-[#292929] hover:bg-[#222] text-left transition-colors"
                  >
                    <div className="relative p-4 flex items-center justify-between group/item">
                      <span>{column.label}</span>

                      {column.sortAllowed !== false && (
                        <IconButton
                          width="21"
                          height="14"
                          viewBox="0 0 21 14"
                          icon={
                            isActive
                              ? sortConfig.direction === "asc"
                                ? "sort-arrow-up"
                                : sortConfig.direction === "desc"
                                  ? "sort-arrow-down"
                                  : "filter"
                              : "filter"
                          }
                          filled
                          stroke={0}
                          onClick={() => handleSort(column.key)}
                          className={
                            isActive
                              ? "text-[#DD272D]"
                              : "absolute w-1/2 right-0 opacity-0 group-hover/item:opacity-100 bg-linear-90 to-[#222] flex justify-end transition-opacity"
                          }
                        />
                      )}
                    </div>
                  </th>
                );
              })}

              <th className="bg-[#292929] text-left p-4 min-w-25">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((item: any, index) => (
              <tr
                key={item.id ?? index}
                className={`border-b border-[#292929] hover:bg-[#222]/50 transition-all duration-200 ${
                  selectedRow === index ? "bg-[#C2272D]/25" : ""
                }`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-4">
                    {typeof item[column.key] === "string" &&
                    item[column.key] === "" ? (
                      <p className="line-clamp-2 opacity-50">
                        No {column.label}
                      </p>
                    ) : column.render ? (
                      column.render(item)
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}

                <td>
                  <IconButton
                    icon="dots-vertical"
                    width="50px"
                    height="30px"
                    stroke={3}
                    onClick={() => {
                      setSelectedRow(index);
                      onRowSelect?.(item);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footer && (
        <div className="p-4 text-end border-t border-[#292929] shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
}
