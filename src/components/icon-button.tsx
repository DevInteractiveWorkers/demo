"use client";
import { Icon } from "./icon";
import { useState } from "react";

export const IconButton = ({
  icon,
  children = "",
}: {
  icon: string;
  children?: React.ReactNode;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Icon icon={icon} filled={hover} />
      {children}
    </div>
  );
};
