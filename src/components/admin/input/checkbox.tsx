import { BasicInputProps, Required } from "./input";
import { IconButton } from "@/components/icons/icon-button";

export type CheckboxProps = {
  type: "checkbox";
  checked?: boolean;
  label?: string | React.ReactNode;
} & BasicInputProps;

export default function CheckboxInput(props: CheckboxProps) {
  const { id, label, checked, onChange } = props;
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <div
          className="relative rounded border border-[#404040] transition-all duration-200 has-checked:border-[#606060] 
            has-checked:bg-[#C2272D] has-disabled:bg-[#404040] has-disabled:opacity-50"
        >
          <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={props.disabled}
            onChange={onChange}
            className="peer absolute w-full h-full opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed"
          />
          {/* ✅ peer MUST come first */}
          <IconButton
            icon="check"
            width={20}
            height={20}
            stroke={2}
            className="peer-checked:scale-100 scale-0 transition-all duration-150"
          />
        </div>
        {label && (
          <span className="text-white">
            {label}
            {props.required && <Required />}
          </span>
        )}
      </label>
    </div>
  );
}
