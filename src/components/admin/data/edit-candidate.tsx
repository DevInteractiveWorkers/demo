"use client";

import { useState } from "react";
import { FormProps } from "@/components/form";
import Input from "../input/input";
import Button from "../button";
import { updateCandidate } from "@/lib/firestore";
import { IconButton } from "@/components/icons/icon-button";
import { useRouter } from "next/navigation";
import CandidatePreview from "../candidate-preview";
import { Loader } from "@/components/loading";
import { Candidate } from "@/lib/type";
import { usePositions, useCandidateForm } from "@/hooks/useCandidateForm";
import { uploadMediaFiles } from "@/lib/uploadMedia";
import { MediaField } from "@/components/media-field";
import ThumbnailPicker from "@/components/video/thumbnail-picker";

export default function EditCandidate(
  props: {
    candidate: Candidate;
    onUpdated?: () => void;
  } & FormProps,
) {
  const router = useRouter();
  const { candidate, onUpdated } = props;

  const positions = usePositions();
  const [saving, setSaving] = useState(false);

  const {
    name,
    setName,
    lastName,
    setLastName,
    position,
    setPosition,
    positionId,
    setPositionId,
    resumeUrl,
    setResumeUrl,
    videoUrl,
    setVideoUrl,
    resumeFile,
    setResumeFile,
    videoFile,
    setVideoFile,
    thumbnail,
    setThumbnail,
    hasHeadband,
    setHasHeadband,
  } = useCandidateForm(candidate);

  async function handleUpdate(e?: React.FormEvent) {
    e?.preventDefault();

    try {
      setSaving(true);

      const urls = await uploadMediaFiles(
        { resume: resumeFile, video: videoFile },
        { resumeUrl, videoUrl },
      );

      await updateCandidate(candidate.id, {
        name,
        lastName,
        positionId,
        resumeUrl: urls.resumeUrl,
        videoUrl: urls.videoUrl,
        thumbnail,
      });

      onUpdated?.();
      props.toggleClose?.();
    } catch (error) {
      console.error("Failed to update candidate:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="w-full h-full min-h-svh flex flex-col relative py-4"
    >
      <div className="flex items-center border-b border-[#292929] pb-4 mb-4">
        {props.toggleClose ? (
          <IconButton
            icon={"close"}
            height={30}
            width={30}
            stroke={1.5}
            onClick={() => props.toggleClose?.()}
          />
        ) : (
          <IconButton
            icon={"angle-left"}
            height={30}
            width={30}
            stroke={1.5}
            onClick={() => router.back()}
          />
        )}
        <h2 className="text-xl font-semibold">Edit Candidate</h2>
      </div>
      <div className="flex flex-col w-full gap-4 h-full justify-around">
        <div className="flex flex-col items-center justify-center">
          <CandidatePreview
            name={name}
            lastName={lastName}
            position={position}
            resumeUrl={resumeUrl}
            resumeFile={resumeFile}
            videoUrl={videoUrl}
            videoFile={videoFile}
            hasHeadband={false}
          />
        </div>
        <div className="grid gap-4">
          <ThumbnailPicker
            src={videoUrl ?? videoFile}
            value={thumbnail}
            onChange={setThumbnail}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First Name"
              example="John"
              required
            />
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              example="Doe"
              required
            />
          </div>
          <Input
            type="select"
            placeholder="Position"
            example="General VA"
            selected={position}
            options={positions}
            onSelect={(option) => {
              setPositionId(option.value);
              setPosition(option.name);
            }}
            required
          />

          <MediaField
            url={resumeUrl}
            onUrlChange={setResumeUrl}
            file={resumeFile}
            onFileSelect={setResumeFile}
            placeholder="Resume URL"
            example="https://s3.interactiveworkers.com/demo/... .pdf"
            accept=".pdf,.doc,.docx"
          />

          <MediaField
            url={videoUrl}
            onUrlChange={setVideoUrl}
            file={videoFile}
            onFileSelect={setVideoFile}
            placeholder="Video URL"
            example="https://s3.interactiveworkers.com/demo/... .mp4"
            accept="video/*"
          />

          <Input
            type="switch"
            label="This video has a headband?"
            checked={hasHeadband}
            onChange={(e) => setHasHeadband(e.target.checked)}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Button disabled dark>
              Delete
            </Button>
            <Button disabled={saving}>
              {saving ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
