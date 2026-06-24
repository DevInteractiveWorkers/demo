"use client";

import { useEffect, useState } from "react";

export default function VideoThumbnail({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const video = document.createElement("video");

    video.crossOrigin = "anonymous";
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    const handleLoaded = () => {
      video.currentTime = 0;
    };

    const handleSeeked = () => {
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(video, 0, 0);

      setThumbnail(canvas.toDataURL("image/jpeg", 0.8));
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [src]);

  if (!thumbnail) {
    return <div className={`animate-pulse bg-[#202020] ${className}`} />;
  }

  return <img src={thumbnail} alt="" className={className} loading="lazy" />;
}
