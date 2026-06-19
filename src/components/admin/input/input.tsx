"use client";

import DefaultInput, { DefaultPops } from "./default-input";
import FileInput, { FileInputProps } from "./file-input";
import Select, { SelectProps } from "./select";
import Switch, { SwitchProps } from "./switch";
import PasswordInput, { PasswordProps } from "./password";
import TextareaInput, { TextareaProps } from "./textarea";
import CheckboxInput, { CheckboxProps } from "./checkbox";
import DateInput, { DateProps } from "./date";

export type BasicInputProps = {
  id?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  disabled?: boolean;
};

export const Required = () => {
  return (
    <>
      {" "}
      <span className="text-[#C2272D]">*</span>
    </>
  );
};

export default function Input(
  props:
    | DefaultPops
    | ({ type: "textarea" } & TextareaProps)
    | ({ type: "password" } & PasswordProps)
    | ({ type: "select" } & SelectProps)
    | ({ type: "file" } & FileInputProps)
    | ({ type: "switch" } & SwitchProps)
    | ({ type: "checkbox" } & CheckboxProps)
    | ({ type: "date" } & DateProps),
) {
  switch (props.type) {
    case "switch": {
      return <Switch {...props} />;
    }
    case "checkbox": {
      return <CheckboxInput {...props} />;
    }
    case "password": {
      return <PasswordInput {...props} />;
    }
    case "textarea": {
      return <TextareaInput {...props} />;
    }
    case "select": {
      return <Select {...props} />;
    }
    case "file": {
      return <FileInput {...props} />;
    }
    case "date": {
      return <DateInput {...props} />;
    }
    default: {
      return <DefaultInput {...props} />;
    }
  }
}
