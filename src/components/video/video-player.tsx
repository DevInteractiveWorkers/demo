"use client";

import React, { useEffect, useRef, useState } from "react";
import { IconButton } from "../icons/icon-button";

export interface VideoPlayerProps {
  videoUrl: string;
  width?: string;
  height?: string;
  isOpen: boolean;
  toggle?: () => void;
  onPlayingChange?: (playing: boolean) => void;
  onReady?: (controls: { toggle: () => void }) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  width = "640px",
  height = "360px",
  isOpen,
  toggle,
  onPlayingChange,
  onReady,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const [progressHover, setProgressHover] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updatePlayingState = (playing: boolean) => {
    setIsVideoPlaying(playing);
    onPlayingChange?.(playing);
  };

  const handlePlay = () => {
    setHasPlayed(true);
    updatePlayingState(true);
  };

  const handleVideoControls = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.ended) {
      video.currentTime = 0;
      video.play();
      handlePlay();
      return;
    }

    if (video.paused) {
      video.play();
      updatePlayingState(true);
    } else {
      video.pause();
      updatePlayingState(false);
    }
  };

  useEffect(() => {
    onReady?.({
      toggle: handleVideoControls,
    });
  }, [onReady]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const updateDuration = () => {
      if (Number.isFinite(video.duration)) {
        setVideoDuration(video.duration);
      }
    };

    if (video.readyState >= 1) {
      updateDuration();
    }

    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("durationchange", updateDuration);

    const handlePlay = () => {
      setHasPlayed(true);
      updatePlayingState(true);
    };

    const handlePause = () => updatePlayingState(false);
    const handleEnded = () => updatePlayingState(false);

    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (isOpen) {
      video.play().catch(console.warn);
    } else {
      video.pause();
      video.currentTime = 0;

      setVideoCurrentTime(0);
      updatePlayingState(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
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
  };

  const seekToPosition = (clientX: number) => {
    const progress = progressRef.current;

    if (!progress || !videoRef.current || videoDuration <= 0) return;

    const rect = progress.getBoundingClientRect();

    const percentage = Math.min(
      1,
      Math.max(0, (clientX - rect.left) / rect.width),
    );

    const newTime = percentage * videoDuration;

    videoRef.current.currentTime = newTime;
    setVideoCurrentTime(newTime);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      seekToPosition(event.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, videoDuration]);

  const progressPercentage =
    videoDuration > 0 ? (videoCurrentTime / videoDuration) * 100 : 0;

  const videoAnimationClass = !hasPlayed
    ? ""
    : isVideoPlaying
      ? "reveal"
      : "hide";

  return (
    <>
      <video
        ref={videoRef}
        width={width}
        height={height}
        src={videoUrl}
        preload="metadata"
        playsInline
        onTimeUpdate={(e) => setVideoCurrentTime(e.currentTarget.currentTime)}
        className={`w-full h-full object-cover faded-video ${videoAnimationClass} transition-all duration-2000
        ${isVideoPlaying ? "translate-x-0" : "translate-x-1/4"}`}
      >
        Your browser does not support the video tag.
      </video>

      <div
        className={`
          absolute
          inset-0
          flex
          justify-center
          items-center
          transition-opacity
          duration-300
          bg-[#18162199]
          ${isVideoPlaying ? "opacity-0 hover:opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <IconButton
          filledOnHover
          icon={
            videoCurrentTime >= videoDuration && videoDuration > 0
              ? "replay"
              : isVideoPlaying
                ? "pause"
                : "play-circle"
          }
          onClick={handleVideoControls}
        />

        <div className="absolute bottom-0 w-full flex justify-evenly items-center gap-2 px-4 pb-4">
          <div
            ref={progressRef}
            className="md:w-9/12 w-8/12 h-1 hover:h-2 transition-all bg-gray-400 rounded-full cursor-pointer relative"
            onClick={(e) => seekToPosition(e.clientX)}
            onMouseDown={(e) => {
              setIsDragging(true);
              seekToPosition(e.clientX);
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();

              const percentage = ((e.clientX - rect.left) / rect.width) * 100;

              setProgressHover(Math.min(100, Math.max(0, percentage)));
            }}
            onMouseLeave={() => setProgressHover(null)}
          >
            {progressHover !== null && (
              <div
                className="absolute h-full rounded-full bg-white/30 transition-all"
                style={{
                  width: `${progressHover}%`,
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
              className="absolute top-1/2 w-4 h-4 rounded-full bg-white shadow-md -translate-y-1/2 -translate-x-1/2 transition-transform"
              style={{
                left: `${progressPercentage}%`,
              }}
            />
          </div>

          <div className="text-white md:text-sm text-xs min-w-[90px] text-right">
            {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;
