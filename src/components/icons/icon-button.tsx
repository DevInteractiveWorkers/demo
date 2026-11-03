"use client";
import { useEffect, useState } from "react";
import { Icon, IconProps } from "./icon";

interface IconButtonProps extends IconProps {
  id?: string;
  icon: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: (e?: any) => void;
  reversed?: boolean;
  filledOnHover?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}

export const IconButton = ({
  id,
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
  viewBox,
  disabled = false,
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
      id={id}
      type={type}
      disabled={disabled}
      className={`cursor-pointer h-min select-none ${className}`}
      onMouseOver={() => !isPortrait && setHover(true)}
      onMouseOut={() => !isPortrait && setHover(false)}
      onTouchStart={() => isPortrait && setHover(true)}
      onTouchEnd={() => isPortrait && setHover(false)}
      onClick={onClick}
    >
      <span
        className={`flex items-center gap-2 pointer-events-none ${reversed && "flex-row-reverse"}`}
      >
        <Icon
          icon={icon}
          filled={filled || (filledOnHover && hover)}
          stroke={stroke}
          width={width}
          height={height}
          viewBox={viewBox}
        />
        {children}
      </span>
    </button>
  );
};
