"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconButton } from "../icons/icon-button";
import { getVideoThumbnail } from "@/lib/getVideoThumbnail";
import { Icon } from "../icons/icon";

type Frame = {
  time: number;
  dataUrl: string | null;
  loading: boolean;
  error: boolean;
};

const MAX_FRAMES = 12;
const MIN_INTERVAL = 2;
const MAX_INTERVAL = 5;

function computeFrameTimes(duration: number): number[] {
  if (!isFinite(duration) || duration <= 0) return [0];

  // Very short video: just grab the start and (if it exists) the end.
  if (duration <= MIN_INTERVAL) {
    return duration < 1 ? [0] : [0, Math.max(duration - 0.2, 0)];
  }

  const rawInterval = duration / MAX_FRAMES;
  const interval = Math.min(Math.max(rawInterval, MIN_INTERVAL), MAX_INTERVAL);

  const times: number[] = [];
  for (let t = 0; t < duration - 0.25; t += interval) {
    times.push(Number(t.toFixed(2)));
  }

  return (times.length ? times : [0]).slice(0, MAX_FRAMES);
}

/**
 * Index of the frame in `frames` whose `time` is closest to `targetTime`.
 * Returns null for an empty frame list — callers must guard on that.
 */
function findClosestFrameIndex(
  frames: Frame[],
  targetTime: number,
): number | null {
  if (frames.length === 0) return null;

  return frames.reduce<number>((closestIndex, frame, i) => {
    const currentDiff = Math.abs(frame.time - targetTime);
    const closestDiff = Math.abs(frames[closestIndex].time - targetTime);
    return currentDiff < closestDiff ? i : closestIndex;
  }, 0);
}

function formatTime(seconds: number) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Resolves a `string | File` video source into a single, stable URL the
 * <video>/frame-extraction code can use — creating (and cleaning up) an
 * object URL when given a File, or passing a string URL through unchanged.
 *
 * Defined at module scope so it's created once, not re-declared on every
 * render of ThumbnailPicker.
 */
function useVideoSrc(src?: string | File): string | undefined {
  const [url, setUrl] = useState<string | undefined>(
    typeof src === "string" ? src : undefined,
  );

  useEffect(() => {
    if (!src) {
      setUrl(undefined);
      return;
    }

    if (typeof src === "string") {
      setUrl(src);
      return;
    }

    const objectUrl = URL.createObjectURL(src);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [src]);

  return url;
}

export interface ThumbnailValue {
  shown: boolean;
  time: number;
}

export interface ThumbnailPickerProps {
  src?: string | File;
  value?: ThumbnailValue;
  onChange?: (thumbnail: ThumbnailValue) => void;
  defaultOpen?: boolean;
}

export default function ThumbnailPicker({
  src,
  value,
  onChange,
  defaultOpen = false,
}: ThumbnailPickerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [duration, setDuration] = useState<number | null>(null);
  const [durationError, setDurationError] = useState(false);
  const [frames, setFrames] = useState<Frame[]>([]);

  const selectedIndex = useMemo(() => {
    if (
      !value?.shown ||
      typeof value.time !== "number" ||
      frames.length === 0
    ) {
      return null;
    }
    return findClosestFrameIndex(frames, value.time);
  }, [frames, value]);

  // Guards against stale async work if `src` changes mid-flight.
  const loadTokenRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startScroll: 0 });

  // Single source of truth for the resolved video URL — handles File→object
  // URL conversion and cleanup internally.
  const videoSrc = useVideoSrc(src);

  // --- Read video duration (metadata only, no full download) -----------
  useEffect(() => {
    setDuration(null);
    setDurationError(false);
    setFrames([]);
    loadTokenRef.current += 1;

    if (!videoSrc) return;

    const token = loadTokenRef.current;
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = videoSrc;

    const onLoaded = () => {
      if (loadTokenRef.current !== token) return;
      setDuration(video.duration || 0);
    };
    const onError = () => {
      if (loadTokenRef.current !== token) return;
      setDurationError(true);
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
    };
  }, [videoSrc]);

  // --- Build the frame slots once duration is known ---------------------
  useEffect(() => {
    if (duration == null) return;

    const times = computeFrameTimes(duration);

    setFrames(
      times.map((time) => ({
        time,
        dataUrl: null,
        loading: false,
        error: false,
      })),
    );
  }, [duration]);

  // --- Lazily extract frames, one at a time, only while open ------------
  useEffect(() => {
    if (!isOpen || !videoSrc || frames.length === 0) return;

    const token = loadTokenRef.current;
    let cancelled = false;

    (async () => {
      for (let i = 0; i < frames.length; i++) {
        if (cancelled || loadTokenRef.current !== token) return;

        setFrames((prev) => {
          if (prev[i]?.dataUrl || prev[i]?.loading) return prev;
          const next = [...prev];
          next[i] = { ...next[i], loading: true };
          return next;
        });

        try {
          const dataUrl = await getVideoThumbnail(videoSrc, frames[i].time);
          if (cancelled || loadTokenRef.current !== token) return;

          setFrames((prev) => {
            const next = [...prev];
            next[i] = {
              ...next[i],
              dataUrl,
              loading: false,
              error: !dataUrl,
            };
            return next;
          });
        } catch {
          if (cancelled || loadTokenRef.current !== token) return;
          setFrames((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], loading: false, error: true };
            return next;
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    })();

    return () => {
      cancelled = true;
    };
    // Only re-run when the picker opens or the frame plan changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, videoSrc, frames.length]);

  const selectFrame = useCallback(
    (index: number) => {
      const frame = frames[index];
      if (!frame || !frame.dataUrl) return;

      if (selectedIndex === index) {
        onChange?.({ shown: false, time: 0 });
      } else {
        onChange?.({
          shown: true,
          time: frame.time,
        });
      }
    },
    [frames, selectedIndex, onChange],
  );

  const selectedLabel = useMemo(() => {
    if (selectedIndex == null)
      return value?.shown ? "Custom thumbnail" : "No thumbnail selected";
    return `Selected: ${formatTime(frames[selectedIndex].time)}`;
  }, [selectedIndex, frames, value]);

  return (
    <div className="rounded-lg border border-[#292929] bg-[#1c1c1c] relative">
      <IconButton
        icon={src ? (isOpen ? "angle-up" : "angle-down") : ""}
        onClick={() => setIsOpen((o) => !o)}
        height={24}
        width={24}
        className="flex items-center justify-between px-4 py-3 w-full"
        reversed={src ? true : false}
      >
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">Pick thumbnail from video</span>
          <span className="text-xs text-gray-500">
            {src
              ? selectedLabel
              : "Add a video URL or upload a video to pick a thumbnail from it."}
          </span>
        </div>
      </IconButton>
      {src && isOpen && (
        <div
          className={`p-4 ${isOpen ? "-translate-y-full overflow-x-hidden w-full" : ""} absolute top-0 left-0`}
        >
          {src && durationError && (
            <p className="text-sm text-red-400">
              Couldn't read this video to extract frames. Try a different video
              or upload a thumbnail image directly.
            </p>
          )}

          {src && !durationError && duration == null && (
            <p className="text-sm text-gray-500">Reading video…</p>
          )}

          {src && frames.length > 0 && (
            <div
              ref={scrollRef}
              role="listbox"
              aria-label="Video frames"
              tabIndex={0}
              className="flex gap-3 overflow-x-scroll rounded-md border border-[#333] bg-black/40 p-3 cursor-grab active:cursor-grabbing select-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <button
                type="button"
                role="option"
                onClick={() => selectedIndex && selectFrame(selectedIndex)}
                className={`relative shrink-0 w-28 aspect-video overflow-hidden rounded-md border-2 transition-colors flex items-center justify-center ${
                  selectedIndex === null
                    ? "text-blue-500 border-blue-500"
                    : "border-transparent hover:border-gray-500 hover:text-blue-500"
                }`}
              >
                <Icon
                  icon="blocked"
                  stroke={0}
                  filled
                  viewBox={"0 0 20 20"}
                  height={30}
                  width={30}
                />
              </button>
              {frames.map((frame, i) => (
                <button
                  key={frame.time}
                  type="button"
                  role="option"
                  aria-selected={selectedIndex === i}
                  onClick={() => selectFrame(i)}
                  disabled={!frame.dataUrl}
                  className={`relative shrink-0 w-28 aspect-video overflow-hidden rounded-md border-2 transition-colors ${
                    selectedIndex === i
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-500"
                  }`}
                >
                  {frame.dataUrl ? (
                    <img
                      src={frame.dataUrl}
                      alt={`Frame at ${formatTime(frame.time)}`}
                      className="h-full w-full object-cover"
                      draggable={false}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#292929] text-xs text-gray-500">
                      {frame.error ? "Failed" : "…"}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 bg-black/70 px-1 text-[10px] text-white">
                    {formatTime(frame.time)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
