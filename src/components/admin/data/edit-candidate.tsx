"use client";

import { useEffect, useState } from "react";
import Form, { FormProps } from "@/components/form";
import Input from "../input";
import Button from "../button";

import { getPositions, updateCandidate } from "@/lib/firestore";

export default function EditCandidate(
  props: {
    candidate: any;
    onUpdated?: () => void;
  } & FormProps,
) {
  const { candidate, onUpdated } = props;

  const [positions, setPositions] = useState<any[]>([]);

  const [name, setName] = useState(candidate.name);
  const [lastName, setLastName] = useState(candidate.lastName);
  const [resumeUrl, setResumeUrl] = useState(candidate.resumeUrl);
  const [videoUrl, setVideoUrl] = useState(candidate.videoUrl);

  const [positionId, setPositionId] = useState(candidate.position?.id ?? "");

  useEffect(() => {
    getPositions().then(setPositions);
  }, []);

  async function handleUpdate() {
    await updateCandidate(candidate.id, {
      name,
      lastName,
      positionId,
      resumeUrl,
      videoUrl,
    });

    onUpdated?.();
    props.toggleClose?.();
  }

  return (
    <Form {...props} onSubmit={handleUpdate}>
      <h2 className="text-xl font-semibold">Edit Candidate</h2>

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
        selected={positions.find((p) => p.id === positionId)?.name}
        options={positions}
        placeholder="Position"
        onSelect={(option) => setPositionId(option.value)}
      />

      <Input
        value={resumeUrl}
        onChange={(e) => setResumeUrl(e.target.value)}
        placeholder="Resume URL"
      />

      <Input
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Video URL"
      />

      <Button>Update</Button>
    </Form>
  );
}
