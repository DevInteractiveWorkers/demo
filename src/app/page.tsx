"use client";

import { ParticlesComponent } from "iw-particles";
import { Navbar } from "@/components/video/navbar";
import RequestDemoForm from "@/components/request-demo-form";
import JumpToButtom from "@/components/jump-to";
import { useEffect, useState } from "react";
import Link from "next/link";
import ParticlesBG from "@/components/particles/particles-bg";
import ParticlesBubble from "@/components/particles/particles-bubble";

export default function Home() {
  const [suggest, setSuggest] = useState<boolean>(false);

  useEffect(() => {
    const showSuggestion = () => {
      setTimeout(() => {
        setSuggest(!suggest);
      }, 500);
    };
    showSuggestion();
  }, []);

  return (
    <main className="flex flex-col relative justify-center">
      <div
        className={`
          transition-all
          duration-3000
          `}
      >
        <div id="landing" className="h-svh relative">
          <Navbar />
          <ParticlesBG />
          <div className="absolute top-[50svh] md:-translate-y-1/2">
            <h1 className="md:text-6xl sm:text-4xl text-[2rem] max-md:leading-7 sm:pb-4 font-extralight md:px-25 sm:px-12 px-4 mb-2">
              Demo Portfolio
              <br />
              <strong className="font-semibold">InteractiveWorkers</strong>
            </h1>

            <div className="flex sm:pt-4 text-2xl gap-5 max-sm:flex-col md:px-25 sm:px-12 px-4 md:w-max w-full max-md:items-center">
              <Link
                href="https://calendly.com/interactiveworkersgm/30min"
                className="bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200"
              >
                Book a Call
              </Link>
            </div>
          </div>
          <div
            className={`transition-all duration-500 ${suggest ? "opacity-100" : "opacity-0"}`}
          >
            {suggest && (
              <JumpToButtom cta="Request Your Demo" href="#request-demo" />
            )}
          </div>
        </div>
        <section
          id="request-demo"
          className="md:px-25 w-full flex justify-center min-h-svh py-5"
        >
          <RequestDemoForm />
        </section>
      </div>
      <div className="relative">
        <JumpToButtom
          cta="Book a Call"
          direction="up"
          href="#landing"
          position="relative"
        />
      </div>
    </main>
  );
}
