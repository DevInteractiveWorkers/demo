import { useState } from "react";

export default function Bubble({ message }: { message: string }) {
  const [delay, setDelay] = useState(500);

  return (
    <span
      onMouseEnter={() => setDelay(0)}
      onMouseLeave={() => setDelay(500)}
      style={{ transitionDelay: `${delay}ms` }}
      className="
        opacity-0 scale-0
        group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-1/2
        transition-all duration-150 text-xs
        bg-[#282828] px-3 py-2 rounded-xl absolute bottom-full w-max max-w-xl border border-[#393939]
        after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
        after:w-0 after:h-0 after:border-solid after:border-[5px_5px_0px_5px] after:border-[#282828_transparent_transparent_transparent]
        before:absolute before:top-full before:left-1/2 before:-translate-x-1/2
        before:w-0 before:h-0 before:border-solid before:border-[6px_6px_0px_6px] before:border-[#393939_transparent_transparent_transparent]
      "
    >
      {message}
    </span>
  );
}
