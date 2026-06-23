"use client";

import ParticlesBG from "@/components/particles/particles-bg";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <section
      id="not-found"
      className="w-full h-svh flex justify-center items-center z-1000 relative"
    >
      <ParticlesBG overflowHidden />
      <div className="max-w-3xl grid justify-items-center space-y-4">
        <h2 className="text-4xl font-medium">Error 404</h2>
        <label>
          <code className="bg-white/10 px-1">{pathname}</code> cannot be found.
        </label>
        <p>
          Ready to see how our top-tier candidates can transform your team? Get
          a tailored demo showcasing candidate videos and resumes matched to
          your specific [position] requirements.
        </p>
        <Link
          href={"/#request-demo"}
          className={`bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 
            active:bg-white active:text-black transition-all duration-200 cursor-pointer disabled:opacity-50`}
        >
          Request Your Demo Here
        </Link>
        <p>
          If you were sent this link by our team or a candidate and believe it's
          broken, don't worry. Our support team will get the correct video and
          resume to you immediately.
        </p>
        <Link
          href={"/support"}
          className={`bg-[#C2272D] px-8 py-2 rounded object-contain hover:scale-95 
            active:bg-white active:text-black transition-all duration-200 cursor-pointer disabled:opacity-50`}
        >
          Contact Support Now
        </Link>
      </div>
    </section>
  );
}
