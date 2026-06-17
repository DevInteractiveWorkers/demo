"use client";

import { ParticlesComponent } from "iw-particles";
import { Navbar } from "@/components/video/navbar";
import RequestDemoForm from "@/components/request-demo-form";
import JumpToButtom from "@/components/jump-to";
import { useEffect, useState } from "react";
import Link from "next/link";

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
        <div id="landing" className="h-svh relative z-50">
          <Navbar />
          <div className="absolute top-[50svh] -translate-y-1/2">
            <h1 className="md:text-6xl text-4xl pb-4 font-medium md:px-25 sm:px-12 px-4">
              Demo Portfolio <br />
              InteractiveWorkers
            </h1>

            <div className="flex pt-4 text-2xl gap-5 max-sm:flex-col md:px-25 sm:px-12 px-4">
              <Link
                href="https://calendly.com/interactiveworkersgm/30min"
                target="_blank"
                className={`bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200 cursor-pointer`}
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
        <div
          id="request-demo"
          className="md:px-25 w-full flex justify-center min-h-svh py-5"
        >
          <RequestDemoForm />
        </div>
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
