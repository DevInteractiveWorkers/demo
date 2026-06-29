"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { IconButton } from "./icons/icon-button";

type DropDownProps = {
  button: ReactNode;
  placeholder?: string | ReactNode;
  children: ReactNode;
  maxHeight?: string | number;
  className?: string;
};

export default function DropDown({
  button,
  children,
  placeholder,
  className = "",
  maxHeight = "max",
}: DropDownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [alignRight, setAlignRight] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    setAlignRight(rect.right > window.innerWidth);
  }, [isOpen]);

  return (
    <div className={className}>
      {placeholder}
      <div
        className="relative border border-[#292929] rounded min-h-10.5 px-3 py-2 flex items-center gap-2 focus-within:outline-1"
        onMouseLeave={() => setIsOpen(false)}
      >
        {button}
        {isOpen && (
          <div
            ref={ref}
            className={`
            absolute top-full z-100
            ${alignRight ? "right-0 left-auto" : "left-0"}
            border rounded border-[#393939] bg-[#292929]
            min-w-max w-full  overflow-y-auto
            `}
            style={{ maxHeight }}
            onMouseLeave={() => setIsOpen(false)}
          >
            {children}
          </div>
        )}
        <IconButton
          filled
          stroke={0}
          width="6"
          height="6"
          icon="angle-down"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
}
