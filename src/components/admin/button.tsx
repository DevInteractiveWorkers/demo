type BasicProps = {
  disabled?: boolean;
  dark?: boolean;
};

type ButtonProps = (
  | {
      type?: "button";
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
    }
  | {
      type: "submit";
    }
) &
  BasicProps &
  ({ children: React.ReactNode } | { label: string });

export default function Button(props: ButtonProps) {
  const { disabled, dark, type = "button", ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled}
      className={`${
        disabled
          ? "opacity-50 cursor-not-allowed bg-gray-500 text-gray-700"
          : `${
              dark ? "bg-black text-[#C2272D]" : "bg-[#C2272D]"
            } cursor-pointer hover:scale-101 active:bg-white active:text-black transition-all duration-200 active:scale-98`
      } px-8 py-2 rounded object-contain`}
    >
      {"children" in props ? props.children : props.label}
    </button>
  );
}
