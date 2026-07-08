"use client";

import { RefObject, useCallback, useMemo, useState } from "react";

import { IconButton } from "../icons/icon-button";
import ProgressBar from "./progress-bar";

interface ControlsProps {
  videoRef: RefObject<HTMLVideoElement | null>;

  playing: boolean;
  duration: number;
  currentTime: number;

  togglePlayback: () => void;
}

export default function Controls({
  videoRef,
  playing,
  duration,
  currentTime,
  togglePlayback,
}: ControlsProps) {
  const [volume, setVolume] = useState(0.5);
  const [previousVolume, setPreviousVolume] = useState(0.5);

  const formatTime = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds)) return "--:--";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(
        2,
        "0",
      )}`;
    }

    return `${mins}:${String(secs).padStart(2, "0")}`;
  }, []);

  const changeVolume = useCallback(
    (value: number) => {
      const video = videoRef.current;

      if (!video) return;

      const newVolume = Math.max(0, Math.min(1, value));

      video.volume = newVolume;
      setVolume(newVolume);

      if (newVolume > 0) {
        setPreviousVolume(newVolume);
      }
    },
    [videoRef],
  );

  const toggleMute = useCallback(() => {
    const video = videoRef.current;

    if (!video) return;

    if (volume === 0) {
      video.volume = previousVolume;
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      video.volume = 0;
      setVolume(0);
    }
  }, [videoRef, volume, previousVolume]);

  const volumeIcon = useMemo(() => {
    if (volume === 0) return "volume-mute";
    if (volume <= 0.5) return "volume-down";
    return "volume-up";
  }, [volume]);

  const isEnded = duration > 0 && currentTime >= duration - 0.05;

  return (
    <div
      className={`
        absolute inset-0
        flex items-center justify-center
        bg-[#18162199] z-10
        transition-opacity duration-300
        ${playing ? "opacity-0 hover:opacity-100" : "opacity-0"}
      `}
    >
      <IconButton
        filledOnHover
        icon={isEnded ? "replay" : playing ? "pause" : "play-circle"}
        onClick={togglePlayback}
      />

      <div className="absolute bottom-0 left-0 w-full flex items-center gap-4 px-4 pb-4">
        {/* Volume */}

        <div className="relative group">
          <IconButton
            icon={volumeIcon}
            filled
            stroke={0}
            size={25}
            onClick={toggleMute}
          />

          <div
            className="
              absolute
              bottom-full
              left-1/2
              -translate-x-1/2
              -translate-y-1/2
              -rotate-90
              opacity-0
              scale-90
              pointer-events-none
              group-hover:opacity-100
              group-hover:scale-100
              group-hover:pointer-events-auto
              transition-all
              duration-200
              bg-black/40
              backdrop-blur-md
              rounded-xl
              shadow-lg
              p-3
            "
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              className="w-24 accent-[#C1272D] cursor-pointer"
            />
          </div>
        </div>

        {/* Progress */}

        <ProgressBar
          videoRef={videoRef}
          duration={duration}
          currentTime={currentTime}
        />

        {/* Time */}

        <div className="min-w-24 text-right text-xs md:text-sm text-white whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}
