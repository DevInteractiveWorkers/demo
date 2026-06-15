import { BasicInputProps, Required } from "./input";

export type DefaultPops = {
  type?: "text" | "email";
  value?: string;
  placeholder?: string;
  example?: string;
} & BasicInputProps;

export default function DefaultInput(props: DefaultPops) {
  const { id, type, value, placeholder, example, onChange } = props;

  return (
    <div className="w-full">
      <label className="w-full">
        {placeholder} {props.required && <Required />}
      </label>
      <input
        id={id}
        value={value}
        type={type ?? "text"}
        onChange={onChange}
        placeholder={example}
        required={props.required}
        className="border rounded border-[#292929] w-full px-4 py-2 placeholder-shown:opacity-50"
      />
    </div>
  );
}
