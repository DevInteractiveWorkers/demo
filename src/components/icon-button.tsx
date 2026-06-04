"use client";
import { Icon, IconProps } from "./icon";
import { useEffect, useState } from "react";

interface IconButtonProps extends IconProps {
  icon: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  reversed?: boolean;
  filledOnHover?: boolean;
  type?: "button" | "submit";
}

export const IconButton = ({
  icon,
  children = "",
  className = "",
  onClick,
  stroke = 0.6,
  filled,
  filledOnHover,
  reversed,
  height = "72px",
  width = "72px",
  type = "button",
}: IconButtonProps) => {
  const [hover, setHover] = useState(false);
  const [isPortrait, setIsPortait] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsPortait(window.screen.orientation.type.includes("portrait"));
    }
  }, []);

  return (
    <button
      type={type}
      className={`flex items-center gap-2 cursor-pointer h-min select-none ${className} ${
        reversed && "flex-row-reverse"
      }`}
      onMouseOver={() => !isPortrait && setHover(true)}
      onMouseOut={() => !isPortrait && setHover(false)}
      onTouchStart={() => isPortrait && setHover(true)}
      onTouchEnd={() => isPortrait && setHover(false)}
      onClick={onClick}
    >
      <Icon
        icon={icon}
        filled={filled || (filledOnHover && hover)}
        stroke={stroke}
        width={width}
        height={height}
      />
      {children}
    </button>
  );
};
