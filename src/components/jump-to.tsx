"use client";

import { useEffect, useState } from "react";

type AvailableDirections = "up" | "right" | "down" | "left";

export default function JumpToButton({
  cta,
  href,
  direction = "down",
  position = "absolute bottom-0",
}: {
  cta?: string;
  href: string;
  direction?: AvailableDirections;
  position?: string;
}) {
  const [showCTA, setShowCTA] = useState(false);

  const handleClick = () => {
    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center", // enables horizontal scrolling
      });
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const loop = (show: boolean) => {
      timeout = setTimeout(
        () => {
          setShowCTA(!show);
          loop(!show);
        },
        show ? 3000 : 3000,
      );
    };

    loop(showCTA);

    return () => clearTimeout(timeout);
  }, []);

  const pointing = {
    up: "rotate-180",
    right: "-rotate-90",
    down: "rotate-0",
    left: "rotate-90",
  }[direction];

  return (
    <div className={`${position} w-full z-10 flex justify-center p-10`}>
      {cta && (
        <label
          className={`absolute top-0 pointer-events-none transition-all duration-1000 ${
            showCTA
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-0 translate-y-full"
          }`}
        >
          {cta}
        </label>
      )}

      <button
        onClick={handleClick}
        className={`group px-1 aspect-square rounded-full cursor-pointer text-white active:text-[#191919] active:bg-white transition-all duration-300 -translate-y-1 active:translate-y-0 ${pointing}`}
      >
        <svg
          width="49"
          height="49"
          viewBox="0 0 49 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Idle dashed circle */}
          <path
            d="M24.5 1C37.4787 1 48 11.5213 48 24.5C48 37.4787 37.4787 48 24.5 48C11.5213 48 1 37.4787 1 24.5C1 11.5213 11.5213 1 24.5 1Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="opacity-50 group-hover:opacity-0 transition-opacity duration-500 animate-spin-slow origin-center"
          />

          {/* Hover drawing circle */}
          <path
            d="M24.5 1C37.4787 1 48 11.5213 48 24.5C48 37.4787 37.4787 48 24.5 48C11.5213 48 1 37.4787 1 24.5C1 11.5213 11.5213 1 24.5 1Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="148"
            strokeDashoffset="148"
            className="transition-all duration-700 ease-out group-hover:[stroke-dashoffset:0]"
          />

          {/* Arrow */}
          <path
            d="M23.2859 31.71L17.2859 25.71C17.1927 25.6168 17.1187 25.5061 17.0682 25.3842C17.0178 25.2624 16.9918 25.1319 16.9918 25C16.9918 24.8681 17.0178 24.7376 17.0682 24.6157C17.1187 24.4939 17.1927 24.3832 17.2859 24.29C17.3791 24.1968 17.4898 24.1228 17.6117 24.0723C17.7335 24.0219 17.864 23.9959 17.9959 23.9959C18.1278 23.9959 18.2583 24.0219 18.3802 24.0723C18.502 24.1228 18.6127 24.1968 18.7059 24.29L22.9959 28.59L22.9959 17C22.9959 16.7348 23.1013 16.4804 23.2888 16.2929C23.4763 16.1054 23.7307 16 23.9959 16C24.2611 16 24.5155 16.1054 24.703 16.2929C24.8906 16.4804 24.9959 16.7348 24.9959 17L24.9959 28.59L29.2859 24.29C29.4742 24.1017 29.7296 23.9959 29.9959 23.9959C30.2622 23.9959 30.5176 24.1017 30.7059 24.29C30.8942 24.4783 31 24.7337 31 25C31 25.2663 30.8942 25.5217 30.7059 25.71L24.7059 31.71C24.6129 31.8037 24.5023 31.8781 24.3805 31.9289C24.2586 31.9797 24.1279 32.0058 23.9959 32.0058C23.8639 32.0058 23.7332 31.9797 23.6113 31.9289C23.4895 31.8781 23.3789 31.8037 23.2859 31.71V31.71Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
