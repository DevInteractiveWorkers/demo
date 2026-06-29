"use client";

import { useEffect, useState } from "react";
import DropDown from "@/components/dropdown";
import CalendarInput, { DateMode } from "./calendar-input";
import { useFormatDate } from "@/lib/useFormatDate";

export type DateFormat =
  | "date"
  | "day"
  | "weekday"
  | "week"
  | "month"
  | "year"
  | "time"
  | "full-date"
  | "month-year"
  | "long";

export type DateProps = {
  value?: Date | string;
  mode?: DateMode;
  availableModes?: DateMode[];
  onModeChange?: (mode: DateMode) => void;
  onChange?: (date: Date) => void;
};

export default function DateInput({
  value = new Date(),
  onChange,
  mode = "date",
  onModeChange,
  availableModes,
}: DateProps) {
  const currentDate = value instanceof Date ? value : new Date(value);

  const [viewDate, setViewDate] = useState(currentDate);

  useEffect(() => {
    setViewDate(currentDate);
  }, [currentDate]);

  const displayValue =
    mode === "week"
      ? useFormatDate(currentDate, "week")
      : mode === "month"
        ? useFormatDate(currentDate, "month-year")
        : mode === "year"
          ? String(useFormatDate(currentDate, "year"))
          : `${useFormatDate(currentDate, "weekday")}, ${useFormatDate(
              currentDate,
              "long",
            )}`;

  return (
    <DropDown
      className="p-2 w-80"
      button={
        <input
          readOnly
          value={displayValue}
          className="outline-none flex-1 bg-transparent cursor-pointer"
        />
      }
    >
      <CalendarInput
        value={currentDate}
        mode={mode}
        availableModes={availableModes}
        onModeChange={onModeChange}
        viewDate={viewDate}
        onNavigate={setViewDate}
        onSelect={onChange}
      />
    </DropDown>
  );
}
