// components/admin/media-field.tsx
"use client";

import Input from "@/components/admin/input/input";

export function MediaField({
  url,
  onUrlChange,
  file,
  onFileSelect,
  placeholder,
  example,
  accept,
}: {
  url: string;
  onUrlChange: (value: string) => void;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  placeholder: string;
  example: string;
  accept: string;
}) {
  return (
    <div
      className={`grid gap-4 ${
        file || url ? "grid-cols-1" : "grid-cols-[70%_auto]"
      } w-full`}
    >
      {!file && (
        <Input
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder={placeholder}
          example={example}
        />
      )}

      {!url && (
        <Input
          type="file"
          placeholder={`Upload ${placeholder.replace(" URL", "")}`}
          accept={accept}
          onFileSelect={onFileSelect}
        />
      )}
    </div>
  );
}
