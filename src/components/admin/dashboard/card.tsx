import { Icon } from "@/components/icons/icon";
import { IconButton } from "@/components/icons/icon-button";
import VideoThumbnail from "@/components/video/video-thumbnail";
import Link from "next/link";

export function Card({
  item,
  onEdit,
  href,
  onShare,
  onNotFound = { icon: "image", message: "No Source Found" },
}: {
  item: any;
  onEdit?: (any: any) => void;
  href?: string;
  onShare?: () => void;
  onNotFound?: { icon?: string; message?: string };
}) {
  const iconProps = { width: "50px", height: "30px", stroke: 0, filled: true };

  return (
    <div className="border border-[#292929] rounded-xl overflow-hidden relative group/card bg-[#191919]/50 z-0 h-max">
      <div className="absolute top-0 right-0 z-10 pt-4 md:group-hover/card:opacity-100 md:opacity-0 transition-all duration-200 flex">
        {href && (
          <Link href={href}>
            <Icon icon="eye" {...iconProps} filled />
          </Link>
        )}
        {onShare && (
          <IconButton icon="share" {...iconProps} onClick={onShare} />
        )}
        {onEdit && (
          <IconButton
            icon="dots-vertical"
            {...iconProps}
            stroke={3}
            onClick={onEdit}
          />
        )}
      </div>

      <div className="aspect-square bg-[#202020]">
        {item.videoUrl ? (
          <VideoThumbnail
            src={item.videoUrl}
            className="w-full h-full object-cover opacity-50 mask-linear-180 mask-linear-from-black"
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
