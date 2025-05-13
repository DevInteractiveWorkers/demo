import iconsJSON from "@/icons.json";

type IconValue = string | string[];
const icons = iconsJSON as Record<string, IconValue>;

export interface IconProps {
  icon: string;
  filled?: boolean;
  stroke?: number;
  width?: string;
  height?: string;
}

export const Icon = ({
  icon,
  filled = false,
  stroke = 0.6,
  width = "72px",
  height = "72px",
}: IconProps) => {
  const pathData = icons[icon];

  if (!pathData) return null;
  const paths = Array.isArray(pathData) ? pathData : [pathData];

  return (
    <svg
      className={`${width === "auto" ? "w-auto" : `w-[${width}]`} ${
        height === "auto" ? "h-auto" : `h-[${width}]`
      }`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill={filled ? "white" : "none"}
      viewBox="0 0 24 24"
    >
      <path
        fillRule="evenodd"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        d={`${paths.map((d, index) => {
          return d;
        })} `}
      />
    </svg>
  );
};
