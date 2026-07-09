"use client";
import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
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

  // Tracks whether the primary input mechanism is touch (coarse pointer).
  // Re-evaluated on change so hybrid devices (e.g. touch laptops) stay correct.
  const [isTouch, setIsTouch] = useState(false);

  // On mobile, controls are shown/hidden via tap instead of hover.
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    setIsTouch(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

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

  // Tapping the overlay background (not a child control) toggles visibility
  // on touch devices. Desktop keeps the original hover-only behavior.
  const handleOverlayTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isTouch) return;
      if (e.target === e.currentTarget) {
        setControlsVisible((v) => !v);
      }
    },
    [isTouch],
  );

  // On touch, the play button both toggles playback AND reveals controls,
  // so the first tap always has a visible effect.
  const handlePlayTap = useCallback(() => {
    togglePlayback();
    if (isTouch) setControlsVisible(true);
  }, [togglePlayback, isTouch]);

  // On touch, volume has no hover popup — it's a discrete mute/unmute toggle.
  const handleVolumeTap = useCallback(() => {
    toggleMute();
    if (isTouch) setControlsVisible(true);
  }, [toggleMute, isTouch]);

  const overlayOpacityClass = isTouch
    ? playing
      ? controlsVisible
        ? "opacity-100"
        : "opacity-0"
      : "opacity-0"
    : playing
      ? "opacity-0 hover:opacity-100"
      : "opacity-0";

  return (
    <div
      onClick={handleOverlayTap}
      className={`
        absolute inset-0
        flex items-center justify-center
        bg-[#18162199] z-10
        transition-opacity duration-300
        ${overlayOpacityClass}
      `}
    >
      {/* Play / Pause — wrapped to guarantee a 44x44 minimum touch target
          without changing the icon's rendered size. */}
      <div
        className="flex items-center justify-center min-w-[44px] min-h-[44px]"
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          filledOnHover
          icon={isEnded ? "replay" : playing ? "pause" : "play-circle"}
          onClick={handlePlayTap}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full flex items-center gap-4 px-4 pb-4">
        {/* Volume */}
        <div
          className="relative group flex items-center justify-center min-w-[44px] min-h-[44px]"
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            icon={volumeIcon}
            filled
            stroke={0}
            size={25}
            onClick={handleVolumeTap}
          />

          {/* Desktop-only hover popup slider — untouched behavior */}
          {!isTouch && (
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
          )}
        </div>

        {/* Progress — touch-action: none prevents the page from scrolling
            while the user drags to scrub. See notes below re: ProgressBar
            internals needed for touchstart/touchmove/touchend support. */}
        <div
          className="flex-1"
          style={{ touchAction: "none" }}
          onClick={(e) => e.stopPropagation()}
        >
          <ProgressBar
            videoRef={videoRef}
            duration={duration}
            currentTime={currentTime}
          />
        </div>

        {/* Time */}
        <div className="min-w-24 text-right text-xs md:text-sm text-white whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}
