import iconsJSON from "./icons.json";

type IconValue = string | string[];
export const icons = iconsJSON as Record<string, IconValue>;

export interface IconProps {
  icon: string;
  filled?: boolean;
  stroke?: number;

  /** Uses the same value for width & height. Ignored if width/height are provided. */
  size?: number | string;

  width?: string | number;
  height?: string | number;

  color?: string;

  viewBox?: string | { width: number; height?: number };

  className?: string;
}

export const Icon = ({
  icon,
  filled = false,
  stroke = 0.6,
  size = 30,
  width,
  height,
  color,
  viewBox,
  className,
}: IconProps) => {
  const pathData = icons[icon];

  if (!pathData) return null;

  const paths = Array.isArray(pathData) ? pathData : [pathData];

  const svgWidth = width ?? size;
  const svgHeight = height ?? size;

  return (
    <svg
      className={className}
      style={{
        width: svgWidth,
        height: svgHeight,
      }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill={filled ? (color ?? "currentColor") : "none"}
      stroke={!filled ? (color ?? "currentColor") : "currentColor"}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMidYMid meet"
      viewBox={
        typeof viewBox === "string"
          ? viewBox
          : `0 0 ${viewBox?.width ?? 25.65} ${
              viewBox?.height ?? viewBox?.width ?? 25.65
            }`
      }
    >
      {paths.map((d, index) => (
        <path key={index} fillRule="evenodd" d={d} />
      ))}
    </svg>
  );
};
