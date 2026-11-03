"use client";

import { useEffect, useState } from "react";
import Headband from "../video/headband";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

// react-pdf + pdf.js are heavy; load them after the form shell renders.
const PDFReader = dynamic(
  () => import("../pdf-reader").then((m) => m.PDFReader),
  { ssr: false },
);

interface CandidatePreviewProps {
  id?: string;
  href?: string;
  name: string;
  lastName: string;
  position?: string;
  resumeUrl: string;
  resumeFile: File | null;
  videoUrl: string;
  videoFile: File | null;
  hasHeadband: boolean;
}

export default function CandidatePreview({
  id,
  href,
  name,
  lastName,
  position,
  resumeUrl,
  resumeFile,
  videoUrl,
  videoFile,
  hasHeadband,
}: CandidatePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const path = usePathname();

  useEffect(() => {
    if (videoFile) {
      const objectUrl = URL.createObjectURL(videoFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl(videoUrl.trim() || null);
  }, [videoFile, videoUrl]);

  return (
    <div className="grid md:grid-cols-[20%_auto_20%] sm:grid-cols-[auto_70%] gap-4 relative max-h-min justify-items-center overflow-hidden w-full">
      <div className="overflow-hidden md:aspect-auto aspect-video">
        <PDFReader
          file={resumeFile ?? resumeUrl}
          controls={false}
          startAt={2}
        />
      </div>
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#292929] bg-[#292929]">
        <div className="relative aspect-video bg-black">
          {previewUrl ? (
            <>
              <video
                key={previewUrl}
                src={previewUrl}
                controls
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover peer/video"
              />
              {!hasHeadband && (
                <div className="relative scale-40 -translate-x-1/4 peer-hover/video:opacity-0 transition-all duration-150">
                  <Headband
                    visible
                    animated={false}
                    name={`${name || "Fisrt Name"} ${lastName || "Last Name"}`}
                    position={position || "Candidate Position"}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No video selected
            </div>
          )}
        </div>

        <div className="space-y-4 p-5 max-md:hidden">
          <div className="relative">
            <h2 className="text-xl font-semibold">
              {name || (
                <span className="text-gray-500 font-thin">First Name</span>
              )}{" "}
              {lastName || (
                <span className="text-gray-500 font-thin">Last Name</span>
              )}
            </h2>

            <p className="text-gray-500">
              {position || "No position selected"}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Resume</span>

            <span className="max-w-45 truncate text-sm font-medium">
              {resumeFile
                ? resumeFile.name
                : resumeUrl
                  ? "External URL"
                  : "None"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Video</span>

            <span className="max-w-45 truncate text-sm font-medium">
              {videoFile ? videoFile.name : videoUrl ? "External URL" : "None"}
            </span>
          </div>

          <div
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium 
              ${hasHeadband ? "text-blue-400 bg-blue-600/20" : "text-yellow-400 bg-yellow-600/20"}`}
          >
            {hasHeadband ? "Headband Video" : "Auto-Generated Headband"}
          </div>
        </div>
      </div>
      <div className="w-full h-full flex items-end">
        {(href || (id && href)) && (
          <Link
            href={
              path !== href ? href : `/admin/dashboard/candidates/edit?c=${id}`
            }
            className="relative group/redirect flex w-max overflow-hidden transition-transform duration-150
            after:absolute after:w-0 after:border-b after:left-1/2 after:bottom-0 hover:after:w-full after:border-dashed after:transition-all after:duration-500 hover:after:left-0
            before:absolute before:w-full before:border-b before:left-0 before:bottom-0 hover:before:w-0 before:transition-all before:duration-500
            hover:before:left-1/2"
          >
            {path !== href ? "View Page" : "Open Editor"}
          </Link>
        )}
      </div>
    </div>
  );
}
