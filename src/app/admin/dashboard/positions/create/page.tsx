"use client";

import { useMemo, useState } from "react";
import { createPosition, positionExists } from "@/lib/firestore";

import Input from "@/components/admin/input/input";
import Button from "@/components/admin/button";
import PositionIdField from "@/components/admin/position-id-field";
import { Icon, icons } from "@/components/icons/icon";
import { IconButton } from "@/components/icons/icon-button";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loading";
import { showAlert } from "@/lib/show-alert";
import { resolvePositionId, validatePositionId } from "@/lib/position-id";

export default function CreatePositionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [customId, setCustomId] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const positionId = resolvePositionId(customId, name);

  const iconOptions = useMemo(
    () =>
      Object.keys(icons).map((iconName) => ({
        value: iconName,
        name: iconName,
        icon: {
          icon: iconName,
          stroke: 0,
          filled: true,
          width: "24px",
          height: "24px",
        },
      })),
    [],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (submitting) return;

    const trimmedName = name.trim();
    const idError = validatePositionId(positionId);

    if (!trimmedName || idError) {
      await showAlert({
        title: "Missing Information",
        icon: "warning",
        message: idError ?? "Please enter a name for the position.",
      });
      return;
    }

    try {
      setSubmitting(true);

      if (await positionExists(positionId)) {
        await showAlert({
          title: "ID Already In Use",
          icon: "warning",
          message: `A position with the ID "${positionId}" already exists. Choose a different ID or name.`,
        });
        return;
      }

      const confirmed = await showAlert({
        title: "Create Position?",
        icon: "info",
        description: "Sure you want to create this position?",
        message: (
          <ul className="grid gap-1">
            <li>
              <strong>Name:</strong> {trimmedName}
            </li>
            <li>
              <strong>ID:</strong> <code>{positionId}</code>
            </li>
            <li>
              <strong>Icon:</strong> {icon || "None"}
            </li>
          </ul>
        ),
      });

      if (!confirmed) return;

      const id = await createPosition(trimmedName, description, {
        id: positionId,
        icon: icon || undefined,
      });

      await showAlert({
        title: "Position Created!",
        icon: "success",
        message: `"${trimmedName}" has been created with the ID "${id}".`,
      });

      setName("");
      setCustomId("");
      setIcon("");
      setDescription("");
    } catch (error) {
      console.error(error);

      await showAlert({
        title: "Something Went Wrong",
        icon: "warning",
        description: `Failed to create "${trimmedName}". Please check your input and try again.`,
        message: (
          <pre className="rounded-xl bg-black text-white py-3 px-2">
            <code className="text-[#FF0000]">Error: </code>
            <code>
              {error instanceof Error ? error.message : String(error)}
            </code>
          </pre>
        ),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="w-full h-svh flex flex-col relative py-4"
      onSubmit={handleSubmit}
    >
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

      <div className="flex flex-col w-full gap-4 h-full overflow-y-scroll overflow-x-hidden">
        <div className="grid gap-4">
          <div className="flex items-end gap-4">
            {icon && (
              <div className="shrink-0 pb-2">
                <Icon icon={icon} filled stroke={0} size={32} />
              </div>
            )}
            <Input
              type="select"
              placeholder="Icon (optional)"
              example="Select an icon..."
              selected={icon}
              options={iconOptions}
              onSelect={(option) => setIcon(option.value)}
            />
          </div>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Position name"
            example="General Virtual Assistant"
            required
          />

          <PositionIdField
            value={customId}
            onChange={setCustomId}
            resolvedId={positionId}
          />

          <Input
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            example="A remote professional who provides administrative, technical, or creative support to clients from a distance. Acting as digital right-hand partners, VAs handle day-to-day operations so business owners can focus on growth"
          />

          <Button type="submit" disabled={submitting || !name.trim()}>
            {submitting ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              "Create Position"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
