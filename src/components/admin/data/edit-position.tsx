"use client";

import { useMemo, useState } from "react";
import { Icon, icons } from "../../icons/icon";
import { FormProps } from "@/components/form";
import Input from "../input/input";
import Button from "../button";
import PositionIdField from "../position-id-field";
import {
  countCandidatesByPosition,
  migratePositionId,
  PositionMigrationError,
  positionExists,
  updatePosition,
} from "@/lib/firestore";
import { IconButton } from "@/components/icons/icon-button";
import { useRouter } from "next/navigation";
import { showAlert } from "@/lib/show-alert";
import { showChoice } from "@/lib/show-choice";
import {
  generatePositionId,
  normalizePositionId,
  resolvePositionId,
  validatePositionId,
} from "@/lib/position-id";
import { Position } from "@/lib/type";

const POSITIONS_PATH = "/admin/dashboard/positions";

const plural = (n: number) => `${n} candidate${n === 1 ? "" : "s"}`;

export default function EditPosition(
  props: {
    position: Position;
    onUpdated?: () => void;
  } & FormProps,
) {
  const router = useRouter();
  const { position, onUpdated } = props;

  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(position.name ?? "");
  const [customId, setCustomId] = useState(position.id);
  const [icon, setIcon] = useState(position.icon ?? "");
  const [description, setDescription] = useState(position.description ?? "");
  const [active, setActive] = useState(position.active ?? true);

  const positionId = resolvePositionId(customId, name);

  const isDirty =
    name !== (position.name ?? "") ||
    description !== (position.description ?? "") ||
    active !== (position.active ?? true) ||
    icon !== (position.icon ?? "") ||
    positionId !== position.id;

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

  async function handleUpdate(e?: React.FormEvent) {
    e?.preventDefault();

    if (saving) return;

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
      setSaving(true);

      const changes = {
        name: trimmedName,
        description,
        active,
        icon: icon || undefined,
      };

      let finalId = positionId;

      // Name changed but the ID field was left alone: ask what to do with it.
      const idUntouched = normalizePositionId(customId) === position.id;
      const suggestedId = generatePositionId(trimmedName);

      if (
        trimmedName !== position.name &&
        idUntouched &&
        suggestedId !== position.id &&
        !validatePositionId(suggestedId)
      ) {
        const total = await countCandidatesByPosition(position.id);

        const choice = await showChoice({
          title: "Update the ID too?",
          icon: "info",
          message: (
            <>
              <p>
                You renamed this position. If the current ID (
                <code>{position.id}</code>) does not match the position's new
                name, you can update it to a new version.
              </p>
              <p>
                Updating the ID to <code>{suggestedId}</code> will update{" "}
                <strong>{plural(total)}</strong> that use{" "}
                <code>{position.id}</code>.
              </p>
            </>
          ),
          choices: [
            { label: `Keep ID "${position.id}"`, value: "keep", dark: true },
            {
              label: `Update ID to "${suggestedId}"`,
              value: "update",
            },
          ],
        });

        if (!choice) return; // dismissed: nothing is saved

        if (choice === "update") finalId = suggestedId;
        else finalId = position.id;
      }

      if (finalId !== position.id) {
        await updateWithNewId(finalId, changes);
        return;
      }

      const confirmed = await showAlert({
        title: "Update Position?",
        icon: "info",
        message:
          "There's no backup, but you can change it back again whenever you need.",
      });

      if (!confirmed) return;

      await updatePosition(position.id, changes);

      onUpdated?.();
      props.toggleClose?.();
    } catch (error) {
      console.error("Failed to update position:", error);

      await showAlert({
        title: "Something Went Wrong",
        icon: "warning",
        description: `Failed to update "${name}". Please check your input and try again.`,
        message: (
          <pre className="rounded-xl bg-black text-white py-3 px-2 whitespace-pre-wrap">
            <code className="text-[#FF0000]">Error: </code>
            <code>
              {error instanceof Error ? error.message : String(error)}
            </code>
          </pre>
        ),
      });
    } finally {
      setSaving(false);
    }
  }

  async function updateWithNewId(
    newId: string,
    changes: Parameters<typeof migratePositionId>[2],
  ) {
    if (await positionExists(newId)) {
      await showAlert({
        title: "ID Already In Use",
        icon: "warning",
        message: `A position with the ID "${newId}" already exists. Choose a different ID; nothing was changed.`,
      });
      return;
    }

    const total = await countCandidatesByPosition(position.id);

    const confirmed = await showAlert({
      title: "Change Position ID?",
      icon: "warning",
      description: `"${position.id}" → "${newId}"`,
      message: (
        <>
          <p>
            This will update <strong>{plural(total)}</strong> that use{" "}
            <code>{position.id}</code> to <code>{newId}</code>. Once candidates
            are migrated links using <code>/{position.id}</code> will stop
            working.
          </p>
          <p>Do you want to continue?</p>
        </>
      ),
    });

    if (!confirmed) return;

    try {
      const { migrated } = await migratePositionId(position.id, newId, changes);

      await showAlert({
        title: "Position Updated!",
        icon: "success",
        message: `The ID is now "${newId}" and ${plural(migrated)} ${migrated === 1 ? "was" : "were"} migrated.`,
      });

      onUpdated?.();

      if (props.toggleClose) props.toggleClose();
      else router.replace(POSITIONS_PATH);
    } catch (error) {
      const migration =
        error instanceof PositionMigrationError ? error : undefined;

      await showAlert({
        title: migration?.rolledBack
          ? "Update Failed (Rolled Back)"
          : "Update Incomplete",
        icon: "warning",
        description: migration
          ? `Stage: ${migration.stage}. Migrated ${migration.migrated} of ${migration.total} candidates.`
          : undefined,
        message: (
          <pre className="rounded-xl bg-black text-white py-3 px-2 whitespace-pre-wrap">
            <code className="text-[#FF0000]">Error: </code>
            <code>
              {error instanceof Error ? error.message : String(error)}
            </code>
          </pre>
        ),
      });
    }
  }

  async function handleCancel(e?: React.SyntheticEvent) {
    e?.preventDefault();

    if (isDirty) {
      const confirmed = await showAlert({
        title: "Cancel Update?",
        icon: "warning",
        message: `Leave without saving? Any changes you made to "${position.name}" will be lost`,
      });
      if (!confirmed) return;
    }

    if (props.toggleClose) props.toggleClose();
    else router.back();
  }

  return (
    <form
      className="w-full h-full min-h-svh flex flex-col relative py-4"
      onSubmit={handleUpdate}
    >
      <div className="flex items-center border-b border-[#292929] pb-4 mb-4">
        <IconButton
          icon={props.toggleClose ? "close" : "angle-left"}
          height={30}
          width={30}
          stroke={1.5}
          onClick={(e) => handleCancel(e)}
        />
        <h2 className="text-xl font-semibold">Edit Position</h2>
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
            placeholder="Name"
            example="General Virtual Assistant"
            required
          />

          <PositionIdField
            value={customId}
            onChange={setCustomId}
            resolvedId={positionId}
            currentId={position.id}
            disabled={saving}
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

          <Button type="submit" disabled={saving || !isDirty}>
            {saving ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </form>
  );
}
