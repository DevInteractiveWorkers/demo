import { IconButton } from "@/components/icons/icon-button";
import DataTable from "../../data/data-table";
import { useFormatDate } from "@/lib/useFormatDate";
import Tag from "@/components/tag";
import { handleShare } from "@/lib/useShare";

export default function CandidatesTableRender({
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
          label: "Name",
          render: (c) => `${c.name} ${c.lastName}`,
        },
        {
          key: "position",
          label: "Position",
          render: (c) => c.position?.name,
          sortValue: (c) => c.position?.name,
        },
        {
          key: "resume",
          label: "Resume",
          render: (c) => (
            <Tag
              title={c.resumeUrl ? "Resume" : "No Resume"}
              color={c.resumeUrl ? "green-500" : "red-500"}
            />
          ),
        },
        {
          key: "video",
          label: "Video",
          render: (c) => (
            <Tag
              title={c.videoUrl ? "Video" : "No Video"}
              color={c.videoUrl ? "green-500" : "red-500"}
            />
          ),
        },
        {
          key: "createdAt",
          label: "Created",
          render: (c) => useFormatDate(c.createdAt, "long"),
          sortValue: (c) => useFormatDate(c.createdAt, "long"),
        },
        {
          key: "updatedAt",
          label: "Updated",
          render: (c) => useFormatDate(c.lastUpdatedAt, "long"),
          sortValue: (c) => useFormatDate(c.lastUpdatedAt, "long"),
        },
        {
          key: "",
          label: "Demo",
          render: (c) => (
            <IconButton
              icon="share"
              width="50px"
              height="30px"
              stroke={0}
              filled
              onClick={() =>
                handleShare({
                  url: `https://demo.interactiveworkers.com/${c.position.id}/${c.id}`,
                  title: `${c.name} ${c.lastName} from InteractiveWorkers`,
                })
              }
            />
          ),
          sortAllowed: false,
        },
      ]}
      footer={
        <>
          <span className="opacity-50">Total Candidates:</span> {data.length}
        </>
      }
      onRowSelect={onRowSelect}
    />
  );
}
