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

  // NEW
  onRangeSelect?: (start: Date, end: Date) => void;
};

export default function DateInput({
  value = new Date(),
  mode = "date",
  availableModes,
  onModeChange,
  onChange,
  onRangeSelect,
}: DateProps) {
  const currentDate = value instanceof Date ? value : new Date(value);

  const [viewDate, setViewDate] = useState(currentDate);

  useEffect(() => {
    setViewDate(currentDate);
  }, [currentDate]);

  const displayValue = (() => {
    switch (mode) {
      case "week":
        return useFormatDate(currentDate, "week");

      case "month":
        return useFormatDate(currentDate, "month-year");

      case "year":
        return useFormatDate(currentDate, "year");

      case "range":
        // Until a committed range is supplied,
        // show the selected start date.
        return `${useFormatDate(currentDate, "weekday")}, ${useFormatDate(
          currentDate,
          "long",
        )}`;

      default:
        return `${useFormatDate(currentDate, "weekday")}, ${useFormatDate(
          currentDate,
          "long",
        )}`;
    }
  })();

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
        onRangeSelect={onRangeSelect}
      />
    </DropDown>
  );
}
