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

  // Shared by mouse hover and touch drag — computes the ghost-fill
  // percentage from a clientX relative to the track element.
  const updateHoverFromClientX = useCallback((clientX: number) => {
    const progress = progressRef.current;
    if (!progress) return;
    const rect = progress.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    setHoverProgress(Math.max(0, Math.min(100, percentage)));
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      seek(event.clientX);
    };
    const handleMouseUp = () => {
      setDragging(false);
    };

    // Touch equivalents of the mouse drag pattern above. Registered on
    // window (not just the element) so scrubbing keeps working even if
    // the finger drifts outside the bar while dragging.
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      // Prevent the page from scrolling while the user scrubs.
      event.preventDefault();
      seek(touch.clientX);
      updateHoverFromClientX(touch.clientX);
    };
    const handleTouchEnd = () => {
      setDragging(false);
      setHoverProgress(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    // { passive: false } is required so preventDefault() on touchmove
    // actually blocks scroll — passive listeners can't cancel the event.
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, seek, updateHoverFromClientX]);

  const progressPercentage = useMemo(() => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  return (
    // Outer wrapper exists purely to give touch users a taller hit area
    // than the thin visual bar. `py-3 -my-3` expands the touch target
    // without shifting surrounding layout or changing what's painted.
    <div
      className="relative flex-1 py-3 -my-3"
      style={{ touchAction: "none" }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        if (!touch) return;
        setDragging(true);
        seek(touch.clientX);
        updateHoverFromClientX(touch.clientX);
      }}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        if (!touch) return;
        // Actual seeking + preventDefault during an active drag is handled
        // by the window-level listener above (needed for {passive:false}
        // and to keep tracking outside the element bounds). This handler
        // just keeps the ghost fill in sync while the finger is still
        // over the bar itself.
        updateHoverFromClientX(touch.clientX);
      }}
      onTouchEnd={(e) => {
        const touch = e.changedTouches[0];
        if (touch) seek(touch.clientX);
        setDragging(false);
        setHoverProgress(null);
      }}
    >
      <div
        ref={progressRef}
        className="
          relative
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
    </div>
  );
}
