import { formatDate } from "@/lib/formatDate";
import DataTable from "../../data/data-table";
import Tag from "@/components/tag";

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
            <Tag
              title={p.active ? "Active" : "Inactive"}
              color={p.active ? "#00c950" : "#fb2c36"}
            />
          ),
        },
        {
          key: "createdAt",
          label: "Created",
          render: (p) => formatDate(p.createdAt, "long"),
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
