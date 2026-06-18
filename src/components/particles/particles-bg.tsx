"use client";

import { ParticlesComponent } from "iw-particles";
import { usePathname } from "next/navigation";
import ParticlesBubble from "./particles-bubble";

export default function ParticlesBG({
  overflowHidden,
}: {
  overflowHidden?: boolean;
}) {
  const pathname = usePathname();

  if (pathname.includes("dashboard")) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 mask-linear-from-10% mask-linear-0 mask-linear-to-40%">
        <ParticlesComponent id="bg" color="#FFF" />
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none -z-10 mask-linear-from-20% -mask-linear-135 mask-linear-to-60%">
        <ParticlesComponent id="bg" color="#FFF" />
      </div>

      <ParticlesBubble
        className={overflowHidden ? "" : "absolute top-[100svh]"}
      />
    </>
  );
}
