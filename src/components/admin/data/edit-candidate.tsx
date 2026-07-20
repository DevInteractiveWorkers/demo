"use client";

import { useEffect, useState } from "react";
import Form, { FormProps } from "@/components/form";
import Input from "../input/input";
import Button from "../button";
import { getPositions, updateCandidate } from "@/lib/firestore";
import { uploadFile } from "@/lib/useBuckets";

export default function EditCandidate(
  props: {
    candidate: any;
    onUpdated?: () => void;
  } & FormProps,
) {
  const { candidate, onUpdated } = props;

  const [positions, setPositions] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(candidate?.name ?? "");
  const [lastName, setLastName] = useState(candidate?.lastName ?? "");
  const [resumeUrl, setResumeUrl] = useState(candidate?.resumeUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(candidate?.videoUrl ?? "");
  const [position, setPosition] = useState(candidate?.position?.name ?? "");
  const [positionId, setPositionId] = useState(candidate?.position?.id ?? "");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

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

  async function handleUpdate(e?: React.FormEvent) {
    e?.preventDefault();

    try {
      setSaving(true);

      let finalResumeUrl = resumeUrl;
      let finalVideoUrl = videoUrl;

      if (resumeFile) {
        const uploaded = await uploadFile(resumeFile);
        finalResumeUrl = uploaded.url;
      }

      if (videoFile) {
        const uploaded = await uploadFile(videoFile);
        finalVideoUrl = uploaded.url;
      }

      await updateCandidate(candidate.id, {
        name,
        lastName,
        positionId,
        resumeUrl: finalResumeUrl,
        videoUrl: finalVideoUrl,
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
    <Form {...props} onSubmit={handleUpdate}>
      <h2 className="text-xl font-semibold">Edit Candidate</h2>

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="First Name"
        required
      />

      <Input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        required
      />

      <Input
        type="select"
        placeholder="Position"
        selected={position}
        options={positions}
        onSelect={(option) => {
          setPositionId(option.value);
          setPosition(option.name);
        }}
        required
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

      <Button disabled={saving}>{saving ? "Updating..." : "Update"}</Button>
    </Form>
  );
}
