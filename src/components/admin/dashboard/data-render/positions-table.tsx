import { useFormatDate } from "@/lib/useFormatDate";
import DataTable from "../../data/data-table";

export default function PositionsTableRender({
  data,
  onRowSelect,
}: {
  data: any[];
  onRowSelect: (a: any) => void;
}) {
  return (
    <DataTable
      data={data}
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
          <span className="opacity-50">Total Positions:</span> {data.length}
        </>
      }
      onRowSelect={onRowSelect}
    />
  );
}
