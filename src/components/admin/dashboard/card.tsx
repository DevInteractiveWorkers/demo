import { Icon } from "@/components/icons/icon";
import { IconButton } from "@/components/icons/icon-button";

export function Card({
  item,
  onEdit,
  onShare,
  onNotFound = { icon: "image", message: "No Source Found" },
}: {
  item: any;
  onEdit?: () => void;
  onShare?: () => void;
  onNotFound?: { icon?: string; message?: string };
}) {
  return (
    <div className="border border-[#292929] rounded-xl overflow-hidden relative group/card">
      <div className="absolute top-0 right-0 z-10 pt-4 md:group-hover/card:opacity-100 md:opacity-0 transition-all duration-200 flex">
        {onShare && (
          <IconButton
            icon="share"
            width="50px"
            height="30px"
            stroke={0}
            filled
            onClick={onShare}
          />
        )}
        {onEdit && (
          <IconButton
            icon="dots-vertical"
            width="50px"
            height="30px"
            stroke={3}
            onClick={onEdit}
          />
        )}
      </div>

      <div className="aspect-square bg-[#202020]">
        {item.videoUrl ? (
          <video
            src={item.videoUrl}
            className="h-full object-cover opacity-50 mask-linear-180 mask-linear-from-black"
          />
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-full opacity-25">
            <Icon icon={onNotFound.icon!} filled stroke={0} />
            {onNotFound.message}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-medium">{item.name}</h3>
          {item.tag}
        </div>
        <p className="text-sm opacity-60 mt-2 line-clamp-3">
          {item.description}
        </p>
      </div>
    </div>
  );
}
