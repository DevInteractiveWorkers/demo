"use client";

import { createCandidate } from "@/lib/firestore";
import Input from "@/components/admin/input/input";
import Button from "@/components/admin/button";
import { useState, useRef } from "react";
import CandidatePreview from "@/components/admin/candidate-preview";
import { IconButton } from "@/components/icons/icon-button";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loading";
import { useCandidateForm } from "@/hooks/useCandidateForm";
import { usePositions } from "@/hooks/usePositions";
import { uploadMediaFiles } from "@/lib/uploadMedia";
import CandidateMediaFields from "@/components/admin/candidate-media-fields";
import ThumbnailPicker from "@/components/video/thumbnail-picker";
import { showAlert } from "@/lib/show-alert";
import Link from "next/link";

export default function CreateCandidatePage() {
  const router = useRouter();
  const positions = usePositions();

  const form = useCandidateForm();
  const {
    name,
    setName,
    lastName,
    setLastName,
    positionId,
    setPositionId,
    resumeUrl,
    videoUrl,
    resumeFile,
    videoFile,
    thumbnail,
    setThumbnail,
    hasHeadband,
  } = form;

  const [submitting, setSubmitting] = useState(false);
  const lastNameRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);

      const urls = await uploadMediaFiles(
        { resume: resumeFile, video: videoFile },
        { resumeUrl, videoUrl },
      );

      const candidateId = await createCandidate(
        name,
        lastName,
        positionId,
        urls.resumeUrl,
        urls.videoUrl,
        urls.thumbnailUrl,
        hasHeadband,
      );

      const confirmed = await showAlert({
        title: "Candidate Created!",
        icon: "success",
        message: (
          <>
            A demo for "{name} {lastName}" has been created successfully!
            <br />
            <Link href={`/${positionId}/${candidateId}`} className="underline">
              Click here
            </Link>{" "}
            to check out the result.
          </>
        ),
      });

      if (!confirmed) return;

      alert("Candidate created");
    } catch (error) {
      await showAlert({
        title: "Something Went Wrong",
        icon: "warning",
        description: `Failed to create "${name} ${lastName}". Please check your input and try again.`,
        message: (
          <pre className="rounded-xl bg-black text-white py-3 px-2">
            <code className="text-[#FF0000]">Error: </code>
            <code>
              {error instanceof Error ? error.message : String(error)}
            </code>
          </pre>
        ),
      });
    } finally {
      setSubmitting(false);
    }
  }

  const selectedPosition = positions.find(
    (position) => position.value === positionId,
  )?.name;

  return (
    <form className="w-full h-svh flex flex-col relative py-4">
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
      <div className="flex flex-col w-full gap-4 h-full justify-around overflow-y-scroll overflow-x-hidden">
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
          <ThumbnailPicker
            src={videoUrl}
            value={thumbnail}
            onChange={setThumbnail}
          />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 w-full">
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

          <CandidateMediaFields form={form} />

          <Button type="button" disabled={submitting} onClick={handleSubmit}>
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
