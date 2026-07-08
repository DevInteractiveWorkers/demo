"use client";

import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface ProgressBarProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  duration: number;
  currentTime: number;
}

export default function ProgressBar({
  videoRef,
  duration,
  currentTime,
}: ProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const seek = useCallback(
    (clientX: number) => {
      const video = videoRef.current;
      const progress = progressRef.current;

      if (!video || !progress || duration <= 0) return;

      const rect = progress.getBoundingClientRect();

      const percentage = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );

      video.currentTime = percentage * duration;
    },
    [videoRef, duration],
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      seek(event.clientX);
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, seek]);

  const progressPercentage = useMemo(() => {
    if (duration === 0) return 0;

    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  return (
    <div
      ref={progressRef}
      className="
        relative
        flex-1
        h-1
        hover:h-2
        transition-all
        bg-gray-400
        rounded-full
        cursor-pointer
      "
      onClick={(e) => seek(e.clientX)}
      onMouseDown={(e) => {
        setDragging(true);
        seek(e.clientX);
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const percentage = ((e.clientX - rect.left) / rect.width) * 100;

        setHoverProgress(Math.max(0, Math.min(100, percentage)));
      }}
      onMouseLeave={() => setHoverProgress(null)}
    >
      {hoverProgress !== null && (
        <div
          className="absolute h-full rounded-full bg-white/30 transition-all"
          style={{
            width: `${hoverProgress}%`,
          }}
        />
      )}

      <div
        className="absolute h-full rounded-full bg-[#C1272D]"
        style={{
          width: `${progressPercentage}%`,
        }}
      />

      <div
        className="
          absolute
          top-1/2
          w-4
          h-4
          rounded-full
          bg-white
          shadow-md
          -translate-y-1/2
          -translate-x-1/2
        "
        style={{
          left: `${progressPercentage}%`,
        }}
      />
    </div>
  );
}
