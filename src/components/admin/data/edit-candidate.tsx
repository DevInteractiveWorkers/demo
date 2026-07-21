"use client";

import { useEffect, useState } from "react";
import Form, { FormProps } from "@/components/form";
import Input from "../input/input";
import Button from "../button";
import { getPositions, updateCandidate } from "@/lib/firestore";
import { uploadFile } from "@/lib/useBuckets";
import { IconButton } from "@/components/icons/icon-button";
import { useRouter } from "next/navigation";
import CandidatePreview from "../candidate-preview";
import { Loader } from "@/components/loading";

export default function EditCandidate(
  props: {
    candidate: any;
    onUpdated?: () => void;
  } & FormProps,
) {
  const router = useRouter();

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

  const [hasHeadband, setHasHeadband] = useState<boolean>(
    candidate?.hasHeadband ?? false,
  );

  const [hasThumbnail, setHasThumbnail] = useState<boolean>(
    candidate?.hasThumbnail ?? false,
  );

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
        hasHeadband,
        hasThumbnail,
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
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="switch"
              label="This video has a headband?"
              checked={hasHeadband}
              onChange={(e) => setHasHeadband(e.target.checked)}
            />
            <Input
              type="switch"
              label="Show thumbnail"
              checked={hasThumbnail}
              onChange={(e) => setHasThumbnail(e.target.checked)}
            />
          </div>
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
