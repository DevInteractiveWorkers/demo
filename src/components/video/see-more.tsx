"use client";
import { getCandidatesByPosition } from "@/lib/firestore";
import { useEffect, useRef, useState } from "react";
import { Candidate, Position } from "@/lib/type";
import { IconButton } from "../icons/icon-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import VideoThumbnail from "./video-thumbnail";

export default function SeeMore({
  position,
  isOpen,
  toggleClose,
}: {
  position: Position;
  isOpen?: boolean;
  toggleClose?: () => void;
}) {
  const [candidates, setCandidates] = useState<Candidate[]>();
  const pathname = usePathname();

  useEffect(() => {
    const fetchCandidates = async () => {
      console.log(position);
      const data = await getCandidatesByPosition(position.id);
      setCandidates(data);
    };
    fetchCandidates();
  }, []);

  return (
    <div
      className={`
        before:transition-all before:duration-500 before:backdrop-blur-sm before:z-50 before:w-full before:h-full before:absolute 
        before:left-0 before:top-0 before:bg-[#191919]/50 ${isOpen ? "overflow-hidden" : "before:opacity-0 before:pointer-events-none"}
        max-h-svh`}
    >
      <aside
        className={`bg-[#191919] absolute z-50 top-0 right-0 p-4 w-full h-svh md:max-w-3/12 max-w-10/12 transition-all duration-500 overflow-hidden flex flex-col ${
          isOpen ? "" : "translate-x-full"
        }`}
      >
        <div className="flex py-4 shrink-0 items-center justify-around">
          <h2 className="text-2xl text-start md:leading-7">
            See more {position ? `${position.name} candidates` : "candidates"}
          </h2>

          <IconButton
            icon="close"
            stroke={1.5}
            onClick={toggleClose}
            width="50px"
            height="50px"
          />
        </div>

        <ul className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2">
          {candidates &&
            candidates.map((candidate) => {
              const fullName = `${candidate.name} ${candidate.lastName}`;
              const candidateLink = `/${position.id}/${candidate.id}`;

              if (pathname === candidateLink) return;

              return (
                <li
                  key={candidate.id}
                  title={`See ${candidate.name}'s Demo`}
                  className="bg-[#202020] rounded-2xl overflow-hidden hover:outline-2 outline-[#DD272D] hover:scale-95 transition-all duration-500"
                >
                  <CandidatePreview
                    title={fullName}
                    href={candidateLink}
                    videoUrl={candidate.videoUrl}
                  />
                </li>
              );
            })}
        </ul>
      </aside>
    </div>
  );
}

const CandidatePreview = ({
  title,
  href,
  videoUrl,
}: {
  title: string;
  href: string;
  videoUrl: string;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startPreview = () => {
    if (!ref.current) return;

    ref.current.currentTime = 0;
    ref.current.play();

    timeoutRef.current = setTimeout(() => {
      ref.current?.pause();
    }, 5000); // 5 seconds
  };

  const stopPreview = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  };

  return (
    <Link
      href={href}
      className="group/preview"
      onMouseEnter={() => {
        setTimeout(startPreview, 500);
      }}
      onMouseLeave={stopPreview}
    >
      <div className="flex flex-col justify-center items-center w-full h-full relative">
        <VideoThumbnail
          src={videoUrl}
          className="absolute top-0 left-0 w-full h-full group-hover/preview:opacity-0 opacity-50 transition-all duration-200"
        />
        <video
          ref={ref}
          src={videoUrl}
          muted
          playsInline
          preload="metadata"
          className="group-hover/preview:opacity-100 opacity-0 transition-all duration-200"
        />
      </div>

      <p className="text-xl p-4 group-hover/preview:bg-[#DD272D]">{title}</p>
    </Link>
  );
};
