"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Candidate from "@/components/video/candidate";
import { IconButton } from "@/components/icons/icon-button";
import { ParticlesComponent } from "iw-particles";
import { Navbar } from "@/components/video/navbar";
import ParticlesBubble from "@/components/particles/particles-bubble";

const PDFReader = dynamic(() => import("@/components/pdf-reader"), {
  ssr: false,
});

export default function CandidatePageClient({
  candidate,
  position,
  seeMore,
}: {
  candidate: any;
  position: any;
  seeMore?: boolean;
}) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [videoControls, setVideoControls] = useState<{
    toggle: () => void;
  } | null>(null);

  const fullName = `${candidate.name} ${candidate.lastName}`;
  const showIntroControls = !isVideoPlaying;

  const handleWatchVideo = () => {
    if (!isVideoOpen) {
      setIsVideoOpen(true);
      return;
    }

    videoControls?.toggle();
  };

  return (
    <main className="flex flex-col h-dvh overflow-hidden relative justify-center">
      <Navbar
        fixed
        hide={isVideoPlaying}
        position={position}
        seeMore={seeMore}
      />

      <div
        className={`
          absolute
          max-w-full
          flex
          flex-col
          gap-5
          z-10
          transition-all
          duration-1000
          ${showIntroControls ? "left-0 opacity-100" : "-left-full opacity-0"}
        `}
      >
        <h1 className="md:text-6xl text-4xl sm:pb-4 font-medium md:px-25 sm:px-12 px-4">
          {fullName}
          <br />
          {position.name}
        </h1>

        <div className="flex sm:pt-4 text-2xl gap-5 max-sm:flex-col md:px-25 sm:px-12 px-4 w-max">
          <IconButton
            filled
            icon="play"
            className="bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200"
            onClick={handleWatchVideo}
            width="25px"
            height="25px"
          >
            Play
          </IconButton>

          {candidate.resumeUrl && (
            <IconButton
              filled
              icon="info"
              stroke={0}
              className="bg-[#363636] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200"
              onClick={() => setIsPDFOpen(true)}
              width="25px"
              height="25px"
            >
              More info
            </IconButton>
          )}
        </div>
      </div>

      {candidate.videoUrl && (
        <Candidate
          name={fullName}
          position={position.name}
          isOpen={isVideoOpen}
          videoUrl={candidate.videoUrl}
          toggle={() => {
            setIsVideoOpen(false);
            setIsVideoPlaying(false);
          }}
          onPlayingChange={setIsVideoPlaying}
          onReady={setVideoControls}
          hasHeadband={candidate.hasHeadband}
        />
      )}

      {candidate.resumeUrl && (
        <PDFReader
          pdf={candidate.resumeUrl}
          isOpen={isPDFOpen}
          toggle={() => setIsPDFOpen(false)}
        />
      )}

      <ParticlesBubble hidden={isVideoPlaying} />
    </main>
  );
}
