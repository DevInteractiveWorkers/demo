"use client";

import { useEffect, useState } from "react";
import Headband from "./headband";
import VideoPlayer, { VideoPlayerProps } from "./video-player";

interface CandidateProps extends VideoPlayerProps {
  name: string;
  position: string;
}

export default function Candidate({
  videoUrl,
  isOpen,
  toggle,
  onPlayingChange,
  onReady,
  name,
  position,
}: CandidateProps) {
  const [showHeadband, setShowHeadband] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen || !isPlaying) {
      setShowHeadband(false);
      return;
    }

    let cancelled = false;
    let cycleTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    const runCycle = (delay: number) => {
      cycleTimeout = setTimeout(() => {
        if (cancelled) return;

        setShowHeadband(true);

        hideTimeout = setTimeout(() => {
          if (cancelled) return;

          setShowHeadband(false);

          runCycle(2500);
        }, 10000);
      }, delay);
    };

    runCycle(5000);

    return () => {
      cancelled = true;
      clearTimeout(cycleTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isOpen, isPlaying]);

  return (
    <div
      className="
        fixed
        inset-0
        overflow-hidden
        transition-all
        duration-700
      "
    >
      <VideoPlayer
        videoUrl={videoUrl}
        isOpen={isOpen}
        toggle={toggle}
        onPlayingChange={(playing) => {
          setIsPlaying(playing);
          onPlayingChange?.(playing);
        }}
        onReady={onReady}
      />

      {showHeadband && (
        <Headband name={name} position={position} visible={isPlaying} />
      )}
    </div>
  );
}
