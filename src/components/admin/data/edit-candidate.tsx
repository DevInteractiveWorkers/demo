"use client";

import { useState } from "react";
import { FormProps } from "@/components/form";
import Input from "../input/input";
import Button from "../button";
import { deleteCandidate, updateCandidate } from "@/lib/firestore";
import { IconButton } from "@/components/icons/icon-button";
import { useRouter } from "next/navigation";
import CandidatePreview from "../candidate-preview";
import { Loader } from "@/components/loading";
import { Candidate } from "@/lib/type";
import { usePositions, useCandidateForm } from "@/hooks/useCandidateForm";
import { uploadMediaFiles } from "@/lib/uploadMedia";
import { MediaField } from "@/components/media-field";
import ThumbnailPicker from "@/components/video/thumbnail-picker";
import { showAlert } from "@/lib/show-alert";

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
    data,
    initialData,
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

  async function handleUpdate() {
    if (saving) return;

    const confirmed = await showAlert({
      title: "Update Candidate?",
      icon: "info",
      message:
        "There's no backup, but you can change it back again whenever you need.",
    });

    if (!confirmed) return;

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
        hasHeadband,
      });

      onUpdated?.();
      props.toggleClose?.();
    } catch (error) {
      await showAlert({
        title: "Something Went Wrong",
        icon: "warning",
        message: `Failed to update "${name} ${lastName}". Please check your input and try again.`,
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(e: any) {
    e.preventDefault();
    const confirmed = await showAlert({
      title: "Cancel Update?",
      icon: "warning",
      message: `Leave without saving? Any changes you made to "${name} ${lastName}" will be lost`,
    });
    if (!confirmed) return;

    if (props.toggleClose) {
      props.toggleClose();
    } else {
      router.back();
    }
  }

  async function handleDelete(e: any) {
    e.preventDefault();
    const confirmed = await showAlert({
      title: `Delete "${name} ${lastName}"`,
      icon: "warning",
      message: `Are you sure you want to delete "${name} ${lastName}"? This action cannot be undone.`,
    });
    if (!confirmed) return;
    try {
      await deleteCandidate(candidate.id);
    } catch (error) {
      await showAlert({
        title: "Delete Failed",
        icon: "warning",
        message: `Unable to delete "${name} ${lastName}". Please try again.`,
      });
    } finally {
      router.back();
    }
  }

  return (
    <form className="w-full h-full min-h-svh flex flex-col relative py-4">
      <div className="flex items-center border-b border-[#292929] pb-4 mb-4">
        {
          <IconButton
            icon={props.toggleClose ? "close" : "angle-left"}
            height={30}
            width={30}
            stroke={1.5}
            onClick={(e) => handleCancel(e)}
          />
        }
        <h2 className="text-xl font-semibold">Edit Candidate</h2>
      </div>
      <div className="flex flex-col w-full gap-4 h-full justify-around">
        <div className="flex justify-center">
          <CandidatePreview
            id={candidate.id}
            href={`/${positionId}/${candidate.id}`}
            name={name}
            lastName={lastName}
            position={position}
            resumeUrl={resumeUrl}
            resumeFile={resumeFile}
            videoUrl={videoUrl}
            videoFile={videoFile}
            hasHeadband={hasHeadband}
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
            <Button dark onClick={handleDelete}>
              Delete
            </Button>
            <Button
              type="button"
              onClick={handleUpdate}
              disabled={
                saving || JSON.stringify(data) === JSON.stringify(initialData)
              }
            >
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
