"use client";

import { IconButton } from "@/components/icon-button";
import { useState } from "react";
import dynamic from "next/dynamic";
import Candidate from "@/components/candidate";

const PDFReader = dynamic(() => import("@/components/pdf-reader"), {
  ssr: false,
});

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPDFOpen, setIsPDFOpen] = useState(false);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [videoControls, setVideoControls] = useState<{
    toggle: () => void;
  } | null>(null);

  const showIntroControls = !isVideoPlaying;

  const handleWatchVideo = () => {
    if (!isVideoOpen) {
      setIsVideoOpen(true);
      return;
    }

    videoControls?.toggle();
  };

  return (
    <>
      <div
        className={`
          absolute
          lg:max-w-3xl
          md:w-1/2
          max-w-full
          flex
          flex-col
          gap-5
          z-10
          transition-all
          duration-3000
          ${showIntroControls ? "left-0 opacity-100" : "-left-full opacity-0"}
        `}
      >
        <h1 className="text-4xl pb-4 font-medium md:px-25 px-12">
          DEMO <br />
          <span className="font-bold">PORTFOLIO</span>
        </h1>

        <div className="text-lg bg-[#C1272D] md:px-25 px-6 py-5 rounded-r-full">
          <p>
            If you are looking for alternatives to delegate regular assignments
            with the best options for your budget and with a satisfactory degree
            of results guaranteed, a VA is your best choice.
          </p>
        </div>

        <div className="flex pt-4 text-2xl gap-5 max-sm:flex-col md:px-25 px-12">
          <IconButton
            filled
            icon={isVideoPlaying ? "pause" : "play"}
            stroke={0.6}
            onClick={handleWatchVideo}
          >
            WATCH VIDEO
          </IconButton>

          <IconButton
            filled
            icon="watch"
            stroke={0.6}
            onClick={() => setIsPDFOpen(true)}
          >
            RESUME
          </IconButton>
        </div>
      </div>

      <Candidate
        name="Axel Gonzalez"
        position="CCTV Monitoring Agent"
        isOpen={isVideoOpen}
        videoUrl="/portfolios/Axel/Axel.webm"
        toggle={() => {
          setIsVideoOpen(false);
          setIsVideoPlaying(false);
        }}
        onPlayingChange={setIsVideoPlaying}
        onReady={setVideoControls}
      />

      <PDFReader
        pdf="/portfolios/Mauro/MauroLealResumeDEMO.pdf"
        isOpen={isPDFOpen}
        toggle={() => setIsPDFOpen(false)}
      />
    </>
  );
}
