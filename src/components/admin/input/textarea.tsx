import { BasicInputProps, Required } from "./input";

export type TextareaProps = {
  type: "textarea";
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  example?: string;
  rows?: number;
} & BasicInputProps;

export default function TextareaInput(props: TextareaProps) {
  const { id, value, placeholder, example, onChange, rows } = props;
  return (
    <div className="w-full">
      <label className="w-full">
        {placeholder} {props.required && <Required />}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={example}
        required={props.required}
        rows={rows ?? 5}
        className="border rounded border-[#292929] w-full px-4 py-2"
      />
    </div>
  );
}
