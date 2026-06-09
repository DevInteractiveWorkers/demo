"use client";
import { getCandidatesByPosition, getPosition } from "@/lib/firestore";
import { Icon } from "../icons/icon";
import { useEffect, useRef, useState, VideoHTMLAttributes } from "react";
import { Candidate, Position } from "@/lib/type";
import { IconButton } from "../icons/icon-button";
import Link from "next/link";

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
        before:transition-all before:duration-500 before:backdrop-blur-sm before:z-50 before:w-full before:h-full before:absolute before:left-0 before:top-0 before:bg-[#191919]/50 ${isOpen ? "" : "before:opacity-0 before:pointer-events-none"}
      `}
    >
      <aside
        className={`bg-[#191919] absolute z-50 top-0 right-0 p-4 w-full h-full md:max-w-3/12 max-w-10/12 transition-all duration-500 overflow-hidden ${isOpen ? "" : "translate-x-full"}`}
      >
        <div className="flex py-4">
          <h2 className="text-2xl text-start leading-5">
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
        <ul>
          {candidates &&
            candidates.map((candidate) => {
              const fullName = `${candidate.name} ${candidate.lastName}`;
              const candidateLink = `${position.id}/${candidate.id}`;
              return (
                <li className="bg-[#202020] rounded-2xl overflow-hidden hover:outline-2 outline-[#DD272D] hover:scale-95 transition-all duration-500">
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
      className="group/link"
      onMouseEnter={() => {
        setTimeout(startPreview, 500);
      }}
      onMouseLeave={stopPreview}
    >
      <div className="flex flex-col justify-center items-center w-full h-full hover">
        <video
          ref={ref}
          src={videoUrl}
          muted
          playsInline
          preload="metadata"
          className="group-hover/link:opacity-100 opacity-50 transition-all duration-200"
        />
      </div>

      <p className="text-xl p-4 group-hover/link:bg-[#DD272D]">{title}</p>
    </Link>
  );
};
