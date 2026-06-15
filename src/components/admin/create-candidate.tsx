"use client";

import { createCandidate, getPositions } from "@/lib/firestore";

import Input from "./input/input";
import Button from "./button";
import { useState, useEffect } from "react";
import { uploadToGHL } from "@/lib/gohighlevel";
import Form, { FormProps } from "../form";

export default function CreateCandidate(props: FormProps) {
  const [positions, setPositions] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [positionId, setPositionId] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [hasHeadband, setHasHeadband] = useState<boolean>();

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

    try {
      setSubmitting(true);

      let finalResumeUrl = resumeUrl;
      let finalVideoUrl = videoUrl;

      // Upload resume if a file was selected
      if (resumeFile) {
        const uploaded = await uploadToGHL(resumeFile);

        finalResumeUrl = uploaded.url || uploaded.fileUrl || uploaded.mediaUrl;
      }

      // Upload video if a file was selected
      if (videoFile) {
        const uploaded = await uploadToGHL(videoFile);

        finalVideoUrl = uploaded.url || uploaded.fileUrl || uploaded.mediaUrl;
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
    } catch (error) {
      console.error(error);
      alert("Failed to create candidate");
    } finally {
      setSubmitting(false);
      setName("");
      setLastName("");
      setPositionId("");
      setResumeUrl("");
      setVideoUrl("");
      setResumeFile(null);
      setVideoFile(null);
    }
  }

  const { isOpen, toggleClose } = props;

  return (
    <Form isOpen={isOpen} onSubmit={handleSubmit} toggleClose={toggleClose}>
      <h2 className="text-xl font-semibold">Create Candidate</h2>

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="First Name"
      />

      <Input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />
      <Input
        type="select"
        options={positions}
        placeholder="Position"
        example="Select a position..."
        onSelect={(option) => {
          setPositionId(option.value);

          console.log("Selected position:", option);
        }}
      />

      <div
        className={`grid gap-4 ${resumeFile || resumeUrl ? "grid-cols-1" : "grid-cols-[70%_30%]"} w-full`}
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
            onFileSelect={(file) => {
              setResumeFile(file);
            }}
          />
        )}
      </div>

      <div
        className={`grid gap-4 ${videoFile || videoUrl ? "grid-cols-1" : "grid-cols-[70%_30%]"} w-full`}
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
            onFileSelect={(file) => {
              setVideoFile(file);
            }}
          />
        )}
      </div>

      <Input
        type="switch"
        label={"This video has a headband?"}
        onChange={(e) => setHasHeadband(e.target.checked)}
      />

      <Button disabled={submitting}>
        {submitting ? "Creating Candidate..." : "Create Candidate"}
      </Button>
    </Form>
  );
}
