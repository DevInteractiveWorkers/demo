"use client";

import Headband from "./headband";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { VideoPlayerProps } from "./video-player";

const VideoPlayer = dynamic(() => import("@/components/video/video-player"));

interface CandidateProps extends VideoPlayerProps {
  name: string;
  position: string;
  hasHeadband?: boolean;
}

export default function Candidate({
  videoUrl,
  isOpen,
  onPlayingChange,
  onReady,
  name,
  position,
  hasHeadband = false,
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
    <VideoPlayer
      videoUrl={videoUrl}
      isOpen={isOpen}
      onPlayingChange={(playing) => {
        setIsPlaying(playing);
        onPlayingChange?.(playing);
      }}
      onReady={onReady}
    >
      {!hasHeadband && showHeadband && (
        <Headband name={name} position={position} visible={isPlaying} />
      )}
    </VideoPlayer>
  );
}
