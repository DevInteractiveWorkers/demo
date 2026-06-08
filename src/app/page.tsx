"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Candidate from "@/components/video/candidate";
import { IconButton } from "@/components/icons/icon-button";
import { ParticlesComponent } from "iw-particles";
import { Navbar } from "@/components/navbar";

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
    <main className="flex flex-col h-dvh overflow-y-hidden justify-center">
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
          duration-3000
          ${showIntroControls ? "left-0 opacity-100" : "-left-full opacity-0"}
        `}
      >
        <h1 className="text-6xl pb-4 font-medium md:px-25 px-12">
          Axel Gonzalez <br />
          CCTV Monitoring Agent
        </h1>

        <div className="flex pt-4 text-2xl gap-5 max-sm:flex-col md:px-25 px-12">
          <IconButton
            filled
            icon={"play"}
            className="bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200"
            onClick={handleWatchVideo}
            width="25px"
            height="25px"
          >
            Play
          </IconButton>

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
      <div
        className={`fixed bg-[#C2272D] w-full h-auto aspect-square mask-radial-from-0 mask-radial-to-70% left-0 top-full -translate-x-1/2 -translate-y-1/3 overflow-hidden ${isVideoPlaying ? "opacity-0 -translate-x-full" : ""} transition-all duration-2000`}
      >
        <ParticlesComponent id="gradient" color="#191919" />
      </div>
    </main>
  );
}
