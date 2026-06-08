type BasicProps = { disabled?: boolean; dark?: boolean };

type ButtonProps = BasicProps &
  ({ children: React.ReactNode } | { label: string });

export default function Button(props: ButtonProps) {
  const { disabled, dark } = props;
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${dark ? "bg-black text-[#C2272D]" : "bg-[#C2272D]"} px-8 py-2 rounded object-contain hover:scale-95 active:bg-white active:text-black transition-all duration-200 cursor-pointer disabled:opacity-50`}
    >
      {"children" in props ? props.children : props.label}
    </button>
  );
}
