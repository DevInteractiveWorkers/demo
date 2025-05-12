"use client";

import DemoVideo from "@/components/demo-video";
import { IconButton } from "@/components/icon-button";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";

const PDFReader = dynamic(() => import("@/components/pdf-reader"), {
  ssr: false,
});

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPDFOpen, setIsPDFOpen] = useState(false);

  return (
    <>
      <div className="lg:max-w-3xl md:w-1/2 max-w-full flex flex-col gap-5 z-10">
        <h1 className="text-4xl pb-4 font-medium  md:px-25 px-12">
          DEMO <br />
          <span className="font-bold">PORTFOLIO</span>
        </h1>
        <div className="text-lg bg-[#C1272D] md:px-25 px-6 py-5 rounded-r-full">
          {/* <p>
            If you are looking for alternatives to delegate regular assignments
            with the best options for your budget and with a satisfactory degree
            of results guaranteed, a VA is your best choice. Take a look at what
            you would get from your potential virtual team member.
          </p> */}
          <li>Create rough and final cuts. </li>
          <li>Input music. </li>
          <li>Input dialogues. </li>
          <li>Assembly of image or video sequences. </li>
          <li>Color grading. </li>
          <li>Clean background noises. </li>
          <li>And so much more... </li>
        </div>
        <div className="flex pt-4 text-2xl gap-5 max-sm:flex-col  md:px-25 px-12">
          <IconButton
            filled
            icon={"play"}
            stroke={0.6}
            onClick={() => setIsVideoOpen(true)}
          >
            WATCH VIDEO
          </IconButton>
          <IconButton
            filled
            icon={"watch"}
            stroke={0.6}
            onClick={() => setIsPDFOpen(true)}
          >
            RESUME
          </IconButton>
        </div>
      </div>
      <Image
        src={"/hero.png"}
        width={1080}
        height={1080}
        className="absolute right-0 bottom-0 h-full w-min max-lg:hidden -z-0"
        alt="InteractiveWorkers"
      />
      <DemoVideo
        videoUrl="/portfolios/Mauro/MauroLeal.mp4"
        isOpen={isVideoOpen}
        toggle={() => setIsVideoOpen(!isVideoOpen)}
      />
      <PDFReader
        pdf={"/portfolios/Mauro/MauroLealResumeDEMO.pdf"}
        isOpen={isPDFOpen}
        toggle={() => setIsPDFOpen(!isPDFOpen)}
      />
    </>
  );
}
