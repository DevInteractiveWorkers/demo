import Tag from "@/components/tag";
import { Card } from "../card";
import { usePathname, useRouter } from "next/navigation";

export default function PositionsGridRender({ data }: { data: any[] }) {
  const router = useRouter();
  const path = usePathname();

  return data.map((position) => (
    <Card
      key={position.id}
      item={{
        ...position,
        description:
          position.description !== ""
            ? position.description
            : "No description available",
        tag: (
          <Tag
            title={position.active ? "Active" : "Inactive"}
            color={position.active ? "#00c950" : "#fb2c36"}
          />
        ),
      }}
      onEdit={() => router.push(`${path}/edit?p=${position.id}`)}
    />
  ));
}
