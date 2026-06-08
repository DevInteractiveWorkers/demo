// components/admin/data-table.tsx

type Column<T> = {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  footer?: React.ReactNode;
};

export default function DataTable<T>({
  data,
  columns,
  footer,
}: DataTableProps<T>) {
  return (
    <div className="border border-[#292929] rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#292929]">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="py-4 px-4 text-left">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item: any, index) => (
            <tr key={item.id ?? index} className="border-b border-[#292929]">
              {columns.map((column) => (
                <td key={column.key} className="p-4">
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {footer && <div className="p-4 text-end">{footer}</div>}
    </div>
  );
}
