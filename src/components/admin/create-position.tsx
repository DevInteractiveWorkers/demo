"use client";

import { useState } from "react";
import { createPosition } from "@/lib/firestore";
import Input from "./input/input";
import Button from "./button";
import Form, { FormProps } from "../form";

export default function CreatePosition(props: FormProps) {
  const [name, setName] = useState("");
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

  const { isOpen, toggleClose } = props;

  return (
    <Form isOpen={isOpen} onSubmit={handleSubmit} toggleClose={toggleClose}>
      <h2 className="text-xl font-semibold">Create Position</h2>

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
      <Button>Create Position</Button>
    </Form>
  );
}
