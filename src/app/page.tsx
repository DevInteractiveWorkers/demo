"use client";

import { ParticlesComponent } from "iw-particles";
import { Navbar } from "@/components/video/navbar";

export default function Home() {
  return (
    <main className="flex flex-col h-dvh overflow-y-hidden justify-center">
      <Navbar fixed />
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
        `}
      >
        <h1 className="text-6xl pb-4 font-medium md:px-25 px-12">
          Demo Portfolio <br />
          InteractiveWorkers
        </h1>

        {/* <div className="flex pt-4 text-2xl gap-5 max-sm:flex-col md:px-25 px-12">
          <IconButton
            filled
            icon={"play"}
            className="bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200"
            onClick={handleWatchVideo}
            width="25px"
            height="25px"
          >
            Book your free
            <br /> discovery call
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
            See our
            <br />
            services
          </IconButton>
        </div> */}
      </div>

      <div
        className={`fixed bg-[#C2272D] w-full h-auto aspect-square mask-radial-from-0 mask-radial-to-70% left-0 top-full -translate-x-1/2 -translate-y-1/3 overflow-hidden transition-all duration-2000`}
      >
        <ParticlesComponent id="gradient" color="#191919" />
      </div>
      <div className="mask-linear-from-20% -mask-linear-135 mask-linear-to-60% w-full h-full">
        <ParticlesComponent id={"bg"} color="#FFF" />
      </div>
    </main>
  );
}
