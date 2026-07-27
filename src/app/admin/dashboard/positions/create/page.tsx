"use client";

import { useState } from "react";
import { createPosition } from "@/lib/firestore";

import { FormProps } from "@/components/form";
import Input from "@/components/admin/input/input";
import Button from "@/components/admin/button";
import { IconButton } from "@/components/icons/icon-button";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loading";

export default function CreatePositionPage(props: FormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createPosition(name, description);

      alert("Position created");

      setName("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form className="w-full h-full min-h-svh flex flex-col relative py-4">
      <div className="flex items-center border-b border-[#292929] pb-4 mb-4">
        <IconButton
          icon={"angle-left"}
          height={30}
          width={30}
          stroke={1.5}
          onClick={() => router.back()}
        />
        <h2 className="text-xl font-semibold">Create Position</h2>
      </div>

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Position name"
        example="General Virtual Assistant"
      />

      <Input
        type="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        example="A remote professional who provides administrative, technical, or creative support to clients from a distance. Acting as digital right-hand partners, VAs handle day-to-day operations so business owners can focus on growth"
      />
      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          "Create Position"
        )}
      </Button>
    </form>
  );
}
