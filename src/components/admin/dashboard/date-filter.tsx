import Button from "../button";
import Input from "../input/input";
import { FormatType } from "../input/date";
import { IconButton } from "@/components/icons/icon-button";
import { useState } from "react";
import { useIsMobile } from "@/lib/useMobile";

const DateOptions = [
  { name: "Week View", value: "week" },
  { name: "Month View", value: "month" },
  { name: "Year View", value: "year" },
];

export default function DateFilter({
  date,
  setDate,
  format,
  setFormat,
}: {
  date: Date;
  setDate: (date: Date) => void;
  format: { name: string; value: FormatType };
  setFormat: (format: { name: string; value: FormatType }) => void;
}) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="w-full relative"
      onMouseLeave={() => setIsOpen(false)}
      onPointerLeave={() => setIsOpen(false)}
    >
      {isMobile && (
        <IconButton
          icon="calendar"
          stroke={0}
          filled
          width="30px"
          height="30px"
          onClick={() => setIsOpen(!isOpen)}
        />
      )}
      <div
        className={`flex max-md:flex-col gap-2
            ${
              isMobile &&
              `absolute z-10 bg-[#191919] p-4 border border-[#282828] rounded-xl
                ${isOpen ? "left-0 top-full" : "left-0 -top-full opacity-0 scale-0"} transition-all duration-100`
            }
            `}
      >
        <Button onClick={() => setDate(new Date())}>Today</Button>

        <Input
          type="date"
          value={date}
          onChange={setDate}
          format={format.value}
        />

        <Input
          type="select"
          selected={format.value}
          options={DateOptions}
          onSelect={(option) => setFormat(option)}
        />
      </div>
    </div>
  );
}
