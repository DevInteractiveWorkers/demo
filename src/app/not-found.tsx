"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  return (
    <section
      id="not-found"
      className="w-full h-svh flex justify-center items-center z-1000 relative"
    >
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
          className="cursor-pointer hover:text-[#C2272D] transition-all duration-150"
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
          className="cursor-pointer hover:text-[#C2272D] transition-all duration-150"
        >
          Contact Support Now
        </Link>
      </div>
    </section>
  );
}
