import Tag from "@/components/tag";
import { Card } from "../card";
import { Icon } from "@/components/icons/icon";
import { handleShare } from "@/lib/useShare";

export default function PositionsGridRender({
  data,
  onEdit,
}: {
  data: any[];
  onEdit: (any: any) => void;
}) {
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
      onEdit={onEdit}
    />
  ));
}
