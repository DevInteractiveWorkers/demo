import type { Ref } from "react";
import { BasicInputProps, Required } from "./input";

export type DefaultPops = {
  ref?: Ref<HTMLInputElement>;
  type?: "text" | "email";
  value?: string;
  placeholder?: string;
  example?: string;
  onKeyDown?: (e: any) => void;
} & BasicInputProps;

export default function DefaultInput(props: DefaultPops) {
  const { ref, id, type, value, placeholder, example, onChange, onKeyDown } =
    props;

  return (
    <div className="w-full">
      <label className="w-full">
        {placeholder} {props.required && <Required />}
      </label>
      <input
        ref={ref}
        id={id}
        value={value}
        type={type ?? "text"}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={example}
        required={props.required}
        className="border rounded border-[#292929] w-full px-4 py-2 placeholder-shown:opacity-50"
      />
    </div>
  );
}
