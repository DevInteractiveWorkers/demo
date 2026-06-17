"use client";

import { ParticlesComponent } from "iw-particles";
import ParticlesBubble from "./particles-bubble";
import { usePathname } from "next/navigation";

export default function ParticlesBG() {
  const pathname = usePathname();

  if (pathname.includes("dashboard"))
    return (
      <div className="mask-linear-from-10% mask-linear-0 mask-linear-to-40% w-full h-full max-h-svh top-0 left-0 absolute -z-10">
        <ParticlesComponent id={"bg"} color="#FFF" />
      </div>
    );

  return (
    <>
      <div className="mask-linear-from-20% -mask-linear-135 mask-linear-to-60% w-full h-full max-h-svh top-0 left-0 absolute -z-10">
        <ParticlesComponent id={"bg"} color="#FFF" />
      </div>
      <ParticlesBubble />
    </>
  );
}
