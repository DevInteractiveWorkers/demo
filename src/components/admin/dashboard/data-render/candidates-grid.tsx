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
            color={candidate.resumeUrl ? "#00c950" : "#fb2c36"}
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
      onEdit={() => onEdit(candidate)}
      onShare={() =>
        handleShare({
          url: `https://demo.interactiveworkers.com/${candidate.position.id}/${candidate.id}`,
          title: `${candidate.name} ${candidate.lastName} from InteractiveWorkers`,
        })
      }
    />
  ));
}
