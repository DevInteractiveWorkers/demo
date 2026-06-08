// components/admin/data-table.tsx

import { useState } from "react";
import { IconButton } from "../../icons/icon-button";

type Column<T> = {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  footer?: React.ReactNode;
  onRowSelect?: (row: T) => void;
};

export default function DataTable<T>({
  data,
  columns,
  footer,
  onRowSelect,
}: DataTableProps<T>) {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  return (
    <div className="border border-[#292929] rounded-xl relative max-md:overflow-x-scroll">
      <table className="w-full overflow-scroll">
        <thead className="bg-[#292929]">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="py-4 px-4 text-left">
                {column.label}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item: any, index) => (
            <tr
              key={item.id ?? index}
              className={`border-b border-[#292929] transition-all duration-200 ${selectedRow === index ? "bg-[#C2272D]/25" : ""}`}
            >
              {columns.map((column) => (
                <td key={column.key} className="p-4">
                  {column.render ? column.render(item) : item[column.key]}
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
      {footer && <div className="p-4 text-end">{footer}</div>}
    </div>
  );
}
