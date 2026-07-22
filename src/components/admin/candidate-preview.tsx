"use client";

import { useEffect, useState } from "react";
import Headband from "../video/headband";
import { PDFReader } from "../pdf-reader";

interface CandidatePreviewProps {
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

  useEffect(() => {
    if (videoFile) {
      const objectUrl = URL.createObjectURL(videoFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl(videoUrl.trim() || null);
  }, [videoFile, videoUrl]);

  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 relative h-min">
      <div className="overflow-hidden md:aspect-square aspect-video">
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

          {hasHeadband && (
            <div className="inline-flex rounded-full bg-blue-600/20 px-3 py-1 text-sm font-medium text-blue-400">
              Headband Video
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
