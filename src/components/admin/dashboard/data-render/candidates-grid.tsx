import Tag from "@/components/tag";
import { Card } from "../card";
import { Icon } from "@/components/icons/icon";
import { handleShare } from "@/lib/useShare";

export default function CandidateGridRender({
  data,
  onEdit,
}: {
  data: any[];
  onEdit: (any: any) => void;
}) {
  return data.map((candidate) => (
    <Card
      key={candidate.id}
      item={{
        ...candidate,
        name: `${candidate.name} ${candidate.lastName}`,
        description: candidate.position.name,
        tag: (
          <Tag
            title={candidate.resumeUrl ? "Resume" : "No Resume"}
            color={candidate.resumeUrl ? "green-500" : "red-500"}
          >
            <Icon
              icon="file-pdf"
              width="20px"
              height="20px"
              filled
              stroke={0}
            />
          </Tag>
        ),
      }}
      onEdit={onEdit}
      onShare={() =>
        handleShare({
          url: `https://demo.interactiveworkers.com/${candidate.position.id}/${candidate.id}`,
          title: `${candidate.name} ${candidate.lastName} from InteractiveWorkers`,
        })
      }
    />
  ));
}
