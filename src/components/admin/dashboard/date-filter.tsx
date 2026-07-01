import Button from "../button";
import Input from "../input/input";
import { IconButton } from "@/components/icons/icon-button";
import { useState } from "react";
import { useIsMobile } from "@/lib/useMobile";
import { DateMode } from "../input/calendar-input";
import { DateProps } from "../input/date";

type DateFilterProps = {
  date: Date;
  setDate: (date: Date) => void;
  mode: DateMode;
  setMode: (mode: DateMode) => void;
};

export default function DateFilter({
  date,
  setDate,
  mode,
  setMode,
}: DateFilterProps) {
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
        className={`flex max-md:flex-col gap-2 items-center
          ${
            isMobile &&
            `absolute z-10 bg-[#191919] p-4 border border-[#282828] rounded-xl
            ${isOpen ? "left-0 top-full" : "left-0 -top-full opacity-0 scale-0"}
            transition-all duration-100`
          }
        `}
      >
        <Button onClick={() => setDate(new Date())}>Today</Button>

        <Input
          type="date"
          value={date}
          mode={mode}
          availableModes={["week", "month", "year"]}
          onModeChange={setMode}
          onChange={setDate}
        />
      </div>
    </div>
  );
}
