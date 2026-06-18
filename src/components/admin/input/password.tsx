import { useState } from "react";
import { BasicInputProps, Required } from "./input";
import { IconButton } from "@/components/icons/icon-button";

export type PasswordProps = {
  type: "password";
  value?: string;
  placeholder?: string;
  example?: string;
  secret?: boolean;
} & BasicInputProps;

export default function PasswordInput(props: PasswordProps) {
  const { id, value, placeholder, example, onChange, secret } = props;
  const [revealed, setRevealed] = useState<boolean>(!secret);
  return (
    <div className="w-full">
      <label className="w-full">
        {placeholder} {props.required && <Required />}
      </label>
      <div className="w-full relative flex justify-center">
        <input
          type={revealed ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={example}
          required={props.required}
          className={`border rounded border-[#292929] w-full px-4 py-2 ${value === "" && example && "opacity-50"}`}
        />
        <IconButton
          filled
          stroke={0}
          className="absolute top-0 right-0 translate-y-1/2 h-full flex pr-4 z-10"
          onClick={() => setRevealed(!revealed)}
          icon={revealed ? "eye-crossed-out" : "eye"}
          height="25"
          width="25"
        />
      </div>
    </div>
  );
}
