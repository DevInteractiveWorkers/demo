"use client";

import { createCandidate, getPositions } from "@/lib/firestore";

import { useEffect, useState } from "react";
import Input from "./input";
import Button from "./button";

export default function CreateCandidate() {
  const [positions, setPositions] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const [positionId, setPositionId] = useState("");

  const [resumeUrl, setResumeUrl] = useState("");

  const [videoUrl, setVideoUrl] = useState("");

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

    await createCandidate(name, lastName, positionId, resumeUrl, videoUrl);

    alert("Candidate created");

    setName("");
    setLastName("");
    setResumeUrl("");
    setVideoUrl("");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
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

      <Button>Create Candidate</Button>
    </form>
  );
}
