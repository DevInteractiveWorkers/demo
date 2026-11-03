"use client";

import Input from "@/components/admin/input/input";
import { MediaField } from "@/components/media-field";
import type { useCandidateForm } from "@/hooks/useCandidateForm";

type CandidateForm = ReturnType<typeof useCandidateForm>;

// Resume, video and headband inputs shared by the create and edit candidate
// forms. Takes the object returned by `useCandidateForm`.
export default function CandidateMediaFields({
  form,
}: {
  form: Pick<
    CandidateForm,
    | "resumeUrl"
    | "setResumeUrl"
    | "resumeFile"
    | "setResumeFile"
    | "videoUrl"
    | "setVideoUrl"
    | "videoFile"
    | "setVideoFile"
    | "hasHeadband"
    | "setHasHeadband"
  >;
}) {
  return (
    <>
      <MediaField
        url={form.resumeUrl}
        onUrlChange={form.setResumeUrl}
        file={form.resumeFile}
        onFileSelect={form.setResumeFile}
        placeholder="Resume URL"
        example="https://s3.interactiveworkers.com/demo/... .pdf"
        accept=".pdf,.doc,.docx"
      />

      <MediaField
        url={form.videoUrl}
        onUrlChange={form.setVideoUrl}
        file={form.videoFile}
        onFileSelect={form.setVideoFile}
        placeholder="Video URL"
        example="https://s3.interactiveworkers.com/demo/... .mp4"
        accept="video/*"
      />

      <Input
        type="switch"
        label="This video has a headband?"
        checked={form.hasHeadband}
        onChange={(e) => form.setHasHeadband(e.target.checked)}
      />
    </>
  );
}
