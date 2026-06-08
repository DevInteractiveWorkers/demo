"use client";
import { IconButton } from "@/components/icons/icon-button";
import { useIsMobile } from "@/lib/useMobile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Navigation() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const path = usePathname();
  const current = path.split("/").pop();

  return (
    <aside className="md:border-r max-md:border-b max-md:h-min border-[#292929] p-4 flex flex-col items-center gap-4">
      <div
        className={
          isMobile ? "flex w-11/12 items-center justify-between px-4" : ""
        }
      >
        <Link href={"/admin/dashboard"}>
          <Image
            src="/logo/01_Primary_Logo/Primary_Logo-05.png"
            className="w-50 cursor-pointer"
            width={1080}
            height={1080}
            alt="logo"
          />
        </Link>
        {isMobile && (
          <IconButton
            icon={"toggle"}
            width="50px"
            height="50px"
            stroke={1.5}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
        )}
      </div>

      <ul
        className={`w-full ${
          isMobile
            ? `absolute top-0 left-0 bg-[#191919] p-4 max-w-1/2 h-full transition-all duration-500 justify-items-center gap-4 border rounded-r-2xl border-[#292929] z-10 bg-linear-0 from-[#191919] to-[#292929] inset-shadow-[0_-10px_10px_5px_#191919] backdrop-blur-2xl ${isOpen ? "shadow-[0_0_50px_0_#000]" : "-translate-x-full"}`
            : ""
        }`}
      >
        {isMobile && (
          <div className="w-full flex justify-end">
            <IconButton
              icon={"close"}
              width="50px"
              height="50px"
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </div>
        )}

        <NavigationLink href="positions" current={current === "positions"}>
          Positions
        </NavigationLink>
        <NavigationLink href="candidates" current={current === "candidates"}>
          Candidates
        </NavigationLink>
      </ul>
    </aside>
  );
}

const NavigationLink = ({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) => {
  return (
    <li
      className={`cursor-pointer rounded-xl px-4 py-2  hover:bg-[#292929] ${current ? "text-[#C2272D] font-semibold" : ""}`}
    >
      <Link href={`/admin/dashboard/${href}`} prefetch>
        {children}
      </Link>
    </li>
  );
};
