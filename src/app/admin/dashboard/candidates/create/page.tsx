"use client";

import { createCandidate, getPositions } from "@/lib/firestore";
import Input from "@/components/admin/input/input";
import Button from "@/components/admin/button";
import { useState, useEffect, useRef } from "react";
import { uploadFile } from "@/lib/useBuckets";
import CandidatePreview from "@/components/admin/candidate-preview";
import { IconButton } from "@/components/icons/icon-button";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loading";

export default function CreateCandidatePage() {
  const router = useRouter();

  const [positions, setPositions] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [positionId, setPositionId] = useState("");

  const [resumeUrl, setResumeUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [hasHeadband, setHasHeadband] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const lastNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getPositions().then((data) => {
      setPositions(
        data.map((position) => ({
          name: position.name,
          value: position.id,
        })),
      );
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // if (!videoUrl && !videoFile) {
    //   alert("Please provide a video URL or upload a video.");
    //   return;
    // }

    try {
      setSubmitting(true);

      let finalResumeUrl = resumeUrl;
      let finalVideoUrl = videoUrl;

      // 🚀 Upload BOTH in parallel if they exist
      const results = await Promise.allSettled([
        resumeFile ? uploadFile(resumeFile) : null,
        videoFile ? uploadFile(videoFile) : null,
      ]);

      const resumeUpload =
        results[0].status === "fulfilled" ? results[0].value : null;

      const videoUpload =
        results[1].status === "fulfilled" ? results[1].value : null;

      if (resumeFile && !resumeUpload) {
        throw new Error("Resume upload failed");
      }

      if (videoFile && !videoUpload) {
        throw new Error("Video upload failed");
      }

      if (resumeUpload) {
        finalResumeUrl =
          resumeUpload.url ||
          resumeUpload.fileUrl ||
          resumeUpload.mediaUrl ||
          "";
      }

      if (videoUpload) {
        finalVideoUrl =
          videoUpload.url || videoUpload.fileUrl || videoUpload.mediaUrl || "";
      }

      // ❗ hard stop if video still missing
      // if (!finalVideoUrl) {
      //   throw new Error("Video upload failed or missing URL");
      // }

      await createCandidate(
        name,
        lastName,
        positionId,
        finalResumeUrl,
        finalVideoUrl,
        hasHeadband,
        hasHeadband,
      );

      alert("Candidate created");
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setSubmitting(false);
    }
  }

  const selectedPosition = positions.find(
    (position) => position.value === positionId,
  )?.name;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full min-h-svh flex flex-col relative py-4"
    >
      <div className="flex items-center border-b border-[#292929] pb-4 mb-4">
        <IconButton
          icon={"angle-left"}
          height={30}
          width={30}
          stroke={1.5}
          onClick={() => router.back()}
        />
        <h2 className="text-xl font-semibold">Create Candidate</h2>
      </div>
      <div className="flex flex-col w-full gap-4 h-full justify-around">
        <div className="flex flex-col items-center justify-center">
          <CandidatePreview
            name={name}
            lastName={lastName}
            position={selectedPosition}
            resumeUrl={resumeUrl}
            resumeFile={resumeFile}
            videoUrl={videoUrl}
            videoFile={videoFile}
            hasHeadband={hasHeadband}
          />
        </div>
        <div className="grid gap-4">
          <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 w-full`}>
            <Input
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="First Name"
              example="John"
              onKeyDown={(e) => {
                if (e.key === " " && name.trim()) {
                  e.preventDefault();
                  lastNameRef.current?.focus();
                }
              }}
            />

            <Input
              ref={lastNameRef}
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              example="Doe"
            />
          </div>

          <Input
            type="select"
            options={positions}
            required
            placeholder="Position"
            example="Select a position..."
            selected={positionId}
            onSelect={(option) => setPositionId(option.value)}
          />

          <div
            className={`grid gap-4 ${
              resumeFile || resumeUrl ? "grid-cols-1" : "grid-cols-[70%_auto]"
            } w-full`}
          >
            {!resumeFile && (
              <Input
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="Resume URL"
                example="https://s3.interactiveworkers.com/demo/... .pdf"
              />
            )}

            {!resumeUrl && (
              <Input
                type="file"
                placeholder="Upload Resume"
                accept=".pdf,.doc,.docx"
                onFileSelect={(file) => setResumeFile(file)}
              />
            )}
          </div>

          <div
            className={`grid gap-4 ${
              videoFile || videoUrl ? "grid-cols-1" : "grid-cols-[70%_auto]"
            } w-full`}
          >
            {!videoFile && (
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Video URL"
                example="https://s3.interactiveworkers.com/demo/... .mp4"
              />
            )}

            {!videoUrl && (
              <Input
                type="file"
                placeholder="Upload Video"
                accept="video/*"
                onFileSelect={(file) => setVideoFile(file)}
              />
            )}
          </div>

          <Input
            type="switch"
            label="This video has a headband?"
            checked={hasHeadband}
            onChange={(e) => setHasHeadband(e.target.checked)}
          />

          <Button disabled={submitting}>
            {submitting ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              "Create Candidate"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
