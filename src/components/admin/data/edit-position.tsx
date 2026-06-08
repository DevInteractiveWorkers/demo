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

  const [name, setName] = useState(position.name);
  const [description, setDescription] = useState(position.description);
  const [active, setActive] = useState(position.active);

  async function handleUpdate() {
    await updatePosition(position.id, {
      name,
      description,
      active,
    });

    onUpdated?.();
    props.toggleClose?.();
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

      <Button>Update</Button>
    </Form>
  );
}
