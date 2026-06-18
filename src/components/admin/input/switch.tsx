import { BasicInputProps, Required } from "./input";

export type SwitchProps = {
  type: "switch";
  checked?: boolean;
  label?: string | [string, string];
} & BasicInputProps;

export default function Switch(props: SwitchProps) {
  const { id, label, checked, onChange } = props;
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        {label && Array.isArray(label) && (
          <span className="text-white">{label[0]}</span>
        )}
        <div className="relative w-16 h-9">
          {/* ✅ peer MUST come first */}
          <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={props.disabled}
            onChange={onChange}
            className="peer absolute w-full h-full opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed"
          />
          {/* ✅ track */}
          <div className="absolute inset-0 rounded-full border border-[#404040] transition-all duration-200 peer-checked:border-[#606060] peer-checked:bg-[#C2272D] peer-disabled:bg-[#404040] peer-disabled:opacity-50" />
          {/* ✅ thumb */}
          <div className="absolute top-1 left-1 h-7 w-7 rounded-full bg-[#404040] transition-all duration-200 peer-checked:bg-white peer-checked:translate-x-7 peer-active:scale-90" />
        </div>
        {label && (
          <span className="text-white">
            {Array.isArray(label) ? label[1] : label}
            {props.required && <Required />}
          </span>
        )}
      </label>
    </div>
  );
}
