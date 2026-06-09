"use client";

import { useState } from "react";
import Form, { FormProps } from "@/components/form";
import Input from "../input";
import Button from "../button";

import { updatePosition } from "@/lib/firestore";

export default function EditPosition(
  props: {
    position: any;
    onUpdated?: () => void;
  } & FormProps,
) {
  const { position, onUpdated } = props;

  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(position?.name ?? "");
  const [description, setDescription] = useState(position?.description ?? "");
  const [active, setActive] = useState(position?.active ?? true);

  async function handleUpdate(e?: React.FormEvent) {
    e?.preventDefault();

    try {
      setSaving(true);

      console.log("Updating position:", position.id);

      await updatePosition(position.id, {
        name,
        description,
        active,
      });

      onUpdated?.();
      props.toggleClose?.();
    } catch (error) {
      console.error("Failed to update position:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...props} onSubmit={handleUpdate}>
      <h2 className="text-xl font-semibold">Edit Position</h2>

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <Input
        type="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <Input
        type="switch"
        checked={active}
        onChange={(e) => setActive(e.target.checked)}
        label="Active"
      />

      <Button disabled={saving}>{saving ? "Updating..." : "Update"}</Button>
    </Form>
  );
}
