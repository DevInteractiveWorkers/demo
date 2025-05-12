"use client";
import { Icon, IconProps } from "./icon";
import { useState } from "react";

interface IconButtonProps extends IconProps {
  icon: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const IconButton = ({
  icon,
  children = "",
  className = "",
  onClick,
  stroke = 0.6,
  filled,
}: IconButtonProps) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <Icon icon={icon} filled={filled && hover} stroke={stroke} />
      {children}
    </div>
  );
};
