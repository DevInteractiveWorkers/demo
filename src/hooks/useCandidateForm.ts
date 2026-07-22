// hooks/useCandidateForm.ts
import { useEffect, useState } from "react";
import { getPositions } from "@/lib/firestore";
import { Candidate } from "@/lib/type";

export type PositionOption = { name: string; value: string };

export function usePositions() {
  const [positions, setPositions] = useState<PositionOption[]>([]);

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

  return positions;
}

export function useCandidateForm(candidate?: Candidate | null) {
  const [name, setName] = useState(candidate?.name ?? "");
  const [lastName, setLastName] = useState(candidate?.lastName ?? "");
  const [position, setPosition] = useState(candidate?.position?.name ?? "");
  const [positionId, setPositionId] = useState(candidate?.position?.id ?? "");

  const [resumeUrl, setResumeUrl] = useState(candidate?.resumeUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(candidate?.videoUrl ?? "");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [thumbnail, setThumbnail] = useState({
    shown: true,
    time: 0,
  });

  const [hasHeadband, setHasHeadband] = useState<boolean>(
    candidate?.hasHeadband ?? false,
  );

  return {
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
