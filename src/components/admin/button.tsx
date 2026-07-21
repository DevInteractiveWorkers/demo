type BasicProps = { disabled?: boolean; dark?: boolean };

type ButtonProps = (
  | { type?: "button"; onClick?: (e?: any) => void }
  | { type: "submit" }
) &
  BasicProps &
  ({ children: React.ReactNode } | { label: string });

export default function Button(props: ButtonProps) {
  const { disabled, dark, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type={props.type ?? "submit"}
      disabled={disabled}
      className={`${
        dark ? "bg-black text-[#C2272D]" : "bg-[#C2272D]"
      } px-8 py-2 rounded object-contain not-disabled:hover:scale-95 not-disabled:active:bg-white not-disabled:active:text-black transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {"children" in props ? props.children : props.label}
    </button>
  );
}
