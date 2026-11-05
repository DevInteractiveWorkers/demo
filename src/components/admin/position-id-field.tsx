"use client";

import Input from "./input/input";
import { validatePositionId } from "@/lib/position-id";

/** Optional ID input with a live preview of the id that will be saved. */
export default function PositionIdField({
  value,
  onChange,
  resolvedId,
  currentId,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Result of `resolvePositionId(value, name)`. */
  resolvedId: string;
  /** Edit form only: the id the position has today. */
  currentId?: string;
  disabled?: boolean;
}) {
  const error = validatePositionId(resolvedId);
  const changed = currentId !== undefined && resolvedId !== currentId;

  return (
    <div className="grid gap-1">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ID (optional)"
        example="Leave empty to generate it from the name"
        disabled={disabled}
      />
      <p className="text-sm opacity-70" aria-live="polite">
        {error ? (
          <span className="text-[#C2272D] opacity-100">{error}</span>
        ) : (
          <>
            Will be saved as{" "}
            <code className="rounded bg-[#292929] px-1.5 py-0.5">
              {resolvedId}
            </code>
            {changed && (
              <span className="text-[#C2272D]">
                {" "}
                (currently <code>{currentId}</code>)
              </span>
            )}
          </>
        )}
      </p>
    </div>
  );
}
