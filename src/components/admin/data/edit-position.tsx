"use client";

import { useState } from "react";
import { Icon, icons } from "../../icons/icon";
import { FormProps } from "@/components/form";
import Input from "../input/input";
import Button from "../button";
import { updatePosition } from "@/lib/firestore";
import { IconButton } from "@/components/icons/icon-button";
import { useRouter } from "next/navigation";
import Select from "../input/select";

export default function EditPosition(
  props: {
    position: any;
    onUpdated?: () => void;
  } & FormProps,
) {
  const router = useRouter();
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

  const iconOptions = Object.keys(icons).map((iconName) => ({
    value: iconName,
    name: iconName,
    icon: {
      icon: iconName,
      stroke: 0,
      filled: true,
      width: "24px",
      height: "24px",
    },
  }));

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
        <h2 className="text-xl font-semibold">Edit Position</h2>
      </div>
      <Icon icon={position.icon} />

      <Select
        placeholder="Icon"
        example="General VA"
        selected={position.icon}
        options={iconOptions}
        onSelect={(option) => {
          console.log(option);
        }}
      />

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
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
    </form>
  );
}
