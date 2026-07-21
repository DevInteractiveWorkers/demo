"use client";

import { useEffect, useState } from "react";
import { getVideoThumbnail } from "@/lib/getVideoThumbnail";

export default function VideoThumbnail({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getVideoThumbnail(src).then((thumb) => {
      if (mounted) {
        setThumbnail(thumb);
      }
    });

    return () => {
      mounted = false;
    };
  }, [src]);

  if (!thumbnail) {
    return <div className={`animate-pulse bg-[#202020] ${className}`} />;
  }

  return (
    <img src={thumbnail} alt="thumbnail" className={className} loading="lazy" />
  );
}
