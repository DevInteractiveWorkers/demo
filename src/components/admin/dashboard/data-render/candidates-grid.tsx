import Tag from "@/components/tag";
import { Card } from "../card";
import { Icon } from "@/components/icons/icon";
import { handleShare } from "@/lib/useShare";
import { usePathname, useRouter } from "next/navigation";

export default function CandidateGridRender({ data }: { data: any[] }) {
  const router = useRouter();
  const path = usePathname();

  return data.map((candidate) => (
    <Card
      key={candidate.id}
      href={`${window.location.origin}/${candidate.position.id}/${candidate.id}`}
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
      onEdit={() => router.push(`${path}/edit?c=${candidate.id}`)}
      onShare={() =>
        handleShare({
          url: `https://demo.interactiveworkers.com/${candidate.position.id}/${candidate.id}`,
          title: `${candidate.name} ${candidate.lastName} from InteractiveWorkers`,
        })
      }
    />
  ));
}
