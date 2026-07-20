"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Controls from "./controls";

export interface VideoPlayerProps {
  videoUrl: string;
  thumbnailSrc?: string | null;
  width?: string;
  height?: string;
  isOpen: boolean;
  onPlayingChange?: (playing: boolean) => void;
  onReady?: (controls: { toggle: () => void }) => void;
  children?: React.ReactNode;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailSrc,
  isOpen,
  onPlayingChange,
  onReady,
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // onPlayingChange can be a fresh function identity on every parent
  // render. If the listener-setup effect below depended on it directly,
  // React would tear the listeners down and re-run setup on every single
  // play/pause toggle — previously this reset video state mid-playback
  // and caused a runaway reload loop. Keeping the latest callback in a
  // ref lets handlers call the current version without the effect ever
  // needing to depend on it.
  const onPlayingChangeRef = useRef(onPlayingChange);
  useEffect(() => {
    onPlayingChangeRef.current = onPlayingChange;
  }, [onPlayingChange]);

  const togglePlayback = useCallback(async () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.ended) {
      video.currentTime = 0;
    }

    if (video.paused) {
      try {
        await video.play();
      } catch {
        // Rejected play() (no gesture yet, source not ready) — non-fatal.
      }
    } else {
      video.pause();
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleLoaded = () => setDuration(video.duration || 0);

    const handleTime = () => setCurrentTime(video.currentTime);

    const handlePlay = () => {
      setPlaying(true);
      setHasPlayed(true);
      onPlayingChangeRef.current?.(true);
    };

    const handlePause = () => {
      setPlaying(false);
      onPlayingChangeRef.current?.(false);
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("durationchange", handleLoaded);
    video.addEventListener("timeupdate", handleTime);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handlePause);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("durationchange", handleLoaded);
      video.removeEventListener("timeupdate", handleTime);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handlePause);
    };
    // Deliberately NOT depending on onPlayingChange — see the ref above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

  useEffect(() => {
    if (isOpen) return;

    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setCurrentTime(0);
  }, [isOpen]);

  useEffect(() => {
    onReady?.({
      toggle: togglePlayback,
    });
  }, [onReady, togglePlayback]);

  const animationClass = hasPlayed ? (playing ? "reveal" : "hide") : "";
  const safeVideoUrl = videoUrl?.trim();

  return (
    <div
      className={`relative w-full h-full object-cover faded-video transition-all duration-2000
        ${playing ? "translate-x-0" : "translate-x-1/4 opacity-0"} ${animationClass}`}
    >
      {safeVideoUrl && (
        <video
          controls={false}
          ref={videoRef}
          src={safeVideoUrl}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
      )}

      {/* Pause-state fallback: covers the <video> with a poster image
          (or solid black if none is supplied) any time playback isn't
          active — initial state, user-paused, or mid-buffer. This also
          incidentally hides the "black frame with audio" flash some
          browsers show for a beat right after play() resolves. */}
      {!playing &&
        (thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="absolute inset-0 bg-[#191919] pointer-events-none" />
        ))}

      {children}

      <Controls
        videoRef={videoRef}
        playing={playing}
        duration={duration}
        currentTime={currentTime}
        togglePlayback={togglePlayback}
      />
    </div>
  );
};

export default VideoPlayer;
