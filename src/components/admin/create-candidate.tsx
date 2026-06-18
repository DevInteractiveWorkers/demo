"use client";

import { createCandidate, getPositions } from "@/lib/firestore";
import Input from "./input/input";
import Button from "./button";
import { useState, useEffect } from "react";
import { uploadToGHL } from "@/lib/gohighlevel";
import Form, { FormProps } from "../form";

export default function CreateCandidate(props: FormProps) {
  const { isOpen, toggleClose } = props;

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

    if (!videoUrl && !videoFile) {
      alert("Please provide a video URL or upload a video.");
      return;
    }

    try {
      setSubmitting(true);

      let finalResumeUrl = resumeUrl;
      let finalVideoUrl = videoUrl;

      // 🚀 Upload BOTH in parallel if they exist
      const results = await Promise.allSettled([
        resumeFile ? uploadToGHL(resumeFile) : null,
        videoFile ? uploadToGHL(videoFile) : null,
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
      if (!finalVideoUrl) {
        throw new Error("Video upload failed or missing URL");
      }

      await createCandidate(
        name,
        lastName,
        positionId,
        finalResumeUrl,
        finalVideoUrl,
        hasHeadband,
      );

      alert("Candidate created");

      toggleClose?.();
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form isOpen={isOpen} onSubmit={handleSubmit} toggleClose={toggleClose}>
      <h2 className="text-xl font-semibold">Create Candidate</h2>

      <Input
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
        placeholder="First Name"
      />

      <Input
        value={lastName}
        required
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />

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
          resumeFile || resumeUrl ? "grid-cols-1" : "grid-cols-[70%_30%]"
        } w-full`}
      >
        {!resumeFile && (
          <Input
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="Resume URL"
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
          videoFile || videoUrl ? "grid-cols-1" : "grid-cols-[70%_30%]"
        } w-full`}
      >
        {!videoFile && (
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Video URL"
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
        {submitting ? "Creating Candidate..." : "Create Candidate"}
      </Button>
    </Form>
  );
}
