"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { IconButton } from "@/components/icons/icon-button";
import { Navbar } from "@/components/video/navbar";
import { useIsMobile } from "@/lib/useMobile";
import { ParticlesComponent } from "iw-particles";

const Candidate = dynamic(() => import("@/components/video/candidate"));
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

  useEffect(() => {
    const setPageName = () => {
      document.title = `${fullName} from InteractiveWorkers - Demo`;
    };
    setPageName();
  }, []);

  const isMobile = useIsMobile();

  return (
    <main className="flex flex-col h-dvh overflow-hidden relative justify-center select-none">
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
          ${isMobile ? "items-center w-full" : ""}
          ${showIntroControls ? "left-0 opacity-100" : "-left-full opacity-0"}
        `}
      >
        <h1 className="md:text-6xl sm:text-4xl text-[2rem] max-md:leading-7 sm:pb-4 font-extralight md:px-25 sm:px-12 px-4 max-md:mt-[60svh]">
          {fullName}
          <br />
          <strong className="font-semibold">{position.name}</strong>
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
              {/* More info */}
              Resume
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

      {candidate.resumeUrl && isPDFOpen && (
        <PDFReader
          pdf={candidate.resumeUrl}
          isOpen
          toggle={() => setIsPDFOpen(false)}
        />
      )}

      <div
        className={`fixed bg-[#C2272D] md:w-full w-[200%] h-auto aspect-square mask-radial-from-0 mask-radial-to-70% left-0 top-full -translate-x-1/2 -translate-y-1/3 overflow-hidden ${isVideoPlaying ? "opacity-0 -translate-x-full" : ""} transition-all duration-2000 -z-100`}
      >
        <ParticlesComponent id="gradient" color={"#191919"} />
      </div>
    </main>
  );
}
