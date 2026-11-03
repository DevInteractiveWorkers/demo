"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { IconButton } from "@/components/icons/icon-button";
import { Navbar } from "@/components/video/navbar";
import { useIsMobile } from "@/lib/useMobile";

const ParticlesBubble = dynamic(
  () => import("@/components/particles/particles-bubble"),
  { ssr: false },
);
// Candidate mounts a <video> element plus touch/matchMedia-driven controls.
// It must never be rendered on the server — doing so risks a hydration
// mismatch (or an outright crash) the moment any browser-only API runs
// during the render pass instead of inside an effect.
const Candidate = dynamic(() => import("@/components/video/candidate"), {
  ssr: false,
});
// react-pdf + pdf.js are heavy and only needed once the resume is opened.
const PDFReader = dynamic(
  () => import("@/components/pdf-reader").then((m) => m.PDFReader),
  { ssr: false },
);

export default function CandidatePageClient({
  candidate,
  position,
}: {
  candidate: any;
  position: any;
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
    document.title = `${fullName} from InteractiveWorkers`;
  }, [fullName]);

  const isMobile = useIsMobile();

  return (
    <main className="flex flex-col h-dvh overflow-hidden relative justify-center select-none">
      <Navbar fixed hide={isVideoPlaying} />
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
          {candidate.videoUrl && (
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
          )}

          {candidate.resumeUrl && (
            <IconButton
              filled
              icon="info"
              stroke={0}
              className="bg-[#363636] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200"
              onClick={() => setIsPDFOpen((o) => !o)}
              width="25px"
              height="25px"
            >
              Resume
            </IconButton>
          )}
        </div>
      </div>

      {/* Taken out of normal flow entirely. This is the fix for the layout
          collapse: `absolute inset-0` sizes this box against `main`
          (which has a real height via h-dvh) instead of asking Candidate /
          VideoPlayer's `h-full` chain to resolve against an auto-height
          flex item, which is what was collapsing to 0. */}
      {candidate.videoUrl && (
        <div className="absolute inset-0">
          <Candidate
            id={""}
            name={fullName}
            lastName={""}
            resumeUrl={""}
            position={position}
            isOpen={isVideoOpen}
            videoUrl={candidate.videoUrl}
            thumbnail={candidate.thumbnail}
            onPlayingChange={setIsVideoPlaying}
            onReady={setVideoControls}
            hasHeadband={candidate.hasHeadband}
          />
        </div>
      )}
      {candidate.resumeUrl && (
        <div
          className={` flex items-center justify-center backdrop-blur absolute top-0 left-0 
            ${isPDFOpen ? "opacity-100 z-10 w-full h-full" : "opacity-0 w-0 h-0"} transition-opacity duration-500`}
        >
          {isPDFOpen && (
            <>
              <PDFReader
                file={candidate.resumeUrl}
                startAt={2}
                className="md:max-w-1/2 lg:max-w-1/3 max-h-auto z-0"
              />
              <IconButton
                className="cursor-pointer"
                icon="close"
                width={100}
                height={100}
                onClick={() => {
                  setIsPDFOpen((o) => !o);
                }}
              />
            </>
          )}
        </div>
      )}

      <ParticlesBubble hidden={isVideoPlaying} />
    </main>
  );
}
