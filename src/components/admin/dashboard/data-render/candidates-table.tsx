import { IconButton } from "@/components/icons/icon-button";
import DataTable from "../../data/data-table";
import { formatDate } from "@/lib/formatDate";
import Tag from "@/components/tag";
import { handleShare } from "@/lib/useShare";
import VideoThumbnail from "@/components/video/video-thumbnail";

export default function CandidatesTableRender({
  data,
  onRowSelect,
}: {
  data: any[];
  onRowSelect: (a: any) => void;
}) {
  return (
    <DataTable
      name={"candidates"}
      data={data}
      columns={[
        {
          key: "img",
          label: " ",
          render: (c) => {
            return (
              <div className="h-full w-auto min-h-4 aspect-video overflow-hidden relative">
                <VideoThumbnail
                  src={c.videoUrl}
                  className="object-cover absolute top-0 left-0 w-full h-full"
                />
              </div>
            );
          },
        },
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
              color={c.resumeUrl ? "#00c950" : "#fb2c36"}
            />
          ),
          sortValue: (c) => (c.resumeUrl ? "Resume" : "No Resume"),
        },
        {
          key: "video",
          label: "Video",
          render: (c) => (
            <Tag
              title={c.videoUrl ? "Video" : "No Video"}
              color={c.videoUrl ? "#00c950" : "#fb2c36"}
            />
          ),
          sortValue: (c) => (c.videoUrl ? "Video" : "No Video"),
        },
        {
          key: "createdAt",
          label: "Created",
          render: (c) => formatDate(c.createdAt, "long"),
          sortValue: (c) => formatDate(c.createdAt, "long"),
        },
        {
          key: "updatedAt",
          label: "Updated",
          render: (c) => formatDate(c.lastUpdatedAt, "long"),
          sortValue: (c) => formatDate(c.lastUpdatedAt, "long"),
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
