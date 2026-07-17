"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "../icons/icon";
import SeeMore from "./see-more";
import { useState } from "react";
import { IconButton } from "../icons/icon-button";
import { Position } from "@/lib/type";

export const Navbar = ({
  fixed = false,
  hide = false,
  position,
  seeMore,
}: {
  fixed?: boolean;
  hide?: boolean;
  position?: Position;
  seeMore?: boolean;
}) => {
  const [seeMoreOpen, setSeeMore] = useState<boolean>(false);

  return (
    <>
      <nav
        className={`group z-50 ${fixed && "absolute top-0 left-0 w-full h-1/8 "}`}
      >
        <div
          className={`w-full flex justify-between items-center md:px-25 px-12 pb-20 md:pt-10 pt-6 transition-transform duration-300 ${
            fixed
              ? `fixed top-0 left-0 z-50 ${hide && "-translate-y-full group-hover:translate-y-0 bg-linear-0 from-0% to-[#191919]"}`
              : ""
          }`}
        >
          <Link href="https://interactiveworkers.com/" target="_blank">
            <Image
              src="/logo/01_Primary_Logo/Primary_Logo-04.png"
              width={1080}
              height={1080}
              className="w-50 cursor-pointer"
              alt="InteractiveWorkers"
            />
          </Link>
          {/* {seeMore && (
            <IconButton
              icon={"toggle"}
              stroke={1.5}
              onClick={() => setSeeMore(true)}
            />
          )} */}
        </div>
      </nav>
      {/* {position && seeMore && (
        <SeeMore
          position={position}
          isOpen={seeMoreOpen}
          toggleClose={() => setSeeMore(false)}
        />
      )} */}
    </>
  );
};
