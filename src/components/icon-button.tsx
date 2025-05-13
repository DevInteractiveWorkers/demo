"use client";
import { Icon, IconProps } from "./icon";
import { useState } from "react";

interface IconButtonProps extends IconProps {
  icon: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  reversed?: boolean;
}

export const IconButton = ({
  icon,
  children = "",
  className = "",
  onClick,
  stroke = 0.6,
  filled,
  reversed,
}: IconButtonProps) => {
  const [hover, setHover] = useState(false);
  const [isPortrait, setIsPortait] = useState(
    window.screen.orientation.type.includes("portrait")
  );

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer select-none ${className} ${
        reversed && "flex-row-reverse"
      }`}
      onMouseOver={() => !isPortrait && setHover(true)}
      onMouseOut={() => !isPortrait && setHover(false)}
      onTouchStart={() => isPortrait && setHover(true)}
      onTouchEnd={() => isPortrait && setHover(false)}
      onClick={onClick}
    >
      <Icon icon={icon} filled={filled && hover} stroke={stroke} />
      {children}
    </div>
  );
};
