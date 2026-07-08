"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Controls from "./controls";

export interface VideoPlayerProps {
  videoUrl: string;
  width?: string;
  height?: string;
  isOpen: boolean;
  onPlayingChange?: (playing: boolean) => void;
  onReady?: (controls: { toggle: () => void }) => void;
  children?: React.ReactNode;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
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

  const togglePlayback = useCallback(async () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.ended) {
      video.currentTime = 0;
    }

    if (video.paused) {
      try {
        await video.play();
      } catch {}
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
      onPlayingChange?.(true);
    };

    const handlePause = () => {
      setPlaying(false);
      onPlayingChange?.(false);
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
  }, [onPlayingChange]);

  useEffect(() => {
    if (isOpen) return;

    const video = videoRef.current;

    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
  }, [isOpen]);

  useEffect(() => {
    onReady?.({
      toggle: togglePlayback,
    });
  }, [onReady, togglePlayback]);

  const animationClass = hasPlayed ? (playing ? "reveal" : "hide") : "";

  return (
    <div
      className={`w-full h-full object-cover faded-video transition-all duration-2000
        ${playing ? "translate-x-0" : "translate-x-1/4"} ${animationClass}`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        preload="metadata"
        playsInline
        className={`w-full h-full object-cover faded-video transition-transform duration-2000 ${animationClass}`}
      >
        Your browser does not support the video tag.
      </video>

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
