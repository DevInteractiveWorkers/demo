// hooks/useCandidateForm.ts
import { useState } from "react";
import { Candidate } from "@/lib/type";

export function useCandidateForm(candidate?: Candidate | null) {
  const [name, setName] = useState(candidate?.name ?? "");
  const [lastName, setLastName] = useState(candidate?.lastName ?? "");
  const [position, setPosition] = useState(candidate?.position?.name ?? "");
  const [positionId, setPositionId] = useState(candidate?.position?.id ?? "");

  const [resumeUrl, setResumeUrl] = useState(candidate?.resumeUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(candidate?.videoUrl ?? "");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [thumbnail, setThumbnail] = useState(
    candidate?.thumbnail ?? {
      shown: true,
      time: 0,
    },
  );

  const [hasHeadband, setHasHeadband] = useState(
    candidate?.hasHeadband ?? false,
  );

  // Current form values
  const data = {
    name,
    lastName,
    position,
    positionId,
    resumeUrl,
    videoUrl,
    thumbnail,
    hasHeadband,
  };

  const initialData = {
    name: candidate?.name ?? "",
    lastName: candidate?.lastName ?? "",
    position: candidate?.position?.name ?? "",
    positionId: candidate?.position?.id ?? "",
    resumeUrl: candidate?.resumeUrl ?? "",
    videoUrl: candidate?.videoUrl ?? "",
    thumbnail: candidate?.thumbnail ?? {
      shown: true,
      time: 0,
    },
    hasHeadband: candidate?.hasHeadband ?? false,
  };

  return {
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
  };
}
