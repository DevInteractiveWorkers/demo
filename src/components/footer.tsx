import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full p-4 z-100">
      <ul className="flex max-md:flex-col items-center justify-center gap-4 cursor-default max-md:text-xs text-center">
        <li>
          © Copyright 2006 - 2024 Interactiveworkers.
          <br className="md:hidden" /> All Rights Reserved
        </li>
        <span className="max-md:hidden">•</span>
        <li className="group/dev">
          developed by{" "}
          <Link
            href={"https://github.com/juliograterol"}
            className="group-hover/dev:text-[#008080] relative transition-all duration-150 not-group-hover/dev:underline
              after:w-0 group-hover/dev:after:w-full after:h-11/12 after:bg-white after:absolute 
              after:top-1/2 after:-translate-y-1/2 after:left-1/2 group-hover/dev:after:left-0 after:transition-all after:duration-150
              after:-z-10"
          >
            @juliograterol
          </Link>
        </li>
      </ul>
    </footer>
  );
}
