import { useId, useState } from "react";
import { BasicInputProps, Required } from "./input";
import { Icon } from "@/components/icons/icon";

export type FileInputProps = {
  type: "file";
  placeholder?: string;
  accept?: string;
  onFileSelect?: (file: File | null) => void;
} & BasicInputProps;

export default function FileInput(props: FileInputProps) {
  const { id, placeholder, accept, onFileSelect } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [fileName, setFileName] = useState("");

  return (
    <div className="w-full">
      <label className="w-full">
        {placeholder} {props.required && <Required />}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type="file"
          accept={accept}
          required={props.required}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;

            setFileName(file?.name ?? "");
            onFileSelect?.(file);
          }}
        />

        <label
          htmlFor={inputId}
          className="border rounded border-[#292929] px-4 py-2 flex items-center justify-center cursor-pointer relative"
        >
          {fileName ? (
            <span>{fileName}</span>
          ) : (
            <Icon icon="upload" filled stroke={0} width="24" height="24" />
          )}
        </label>
      </div>
    </div>
  );
}
