"use client";

import { IconButton } from "@/components/icons/icon-button";
import { formatDate } from "@/lib/formatDate";

export type FormatType =
  | "date"
  | "day"
  | "week"
  | "month"
  | "year"
  | "time"
  | "full-date"
  | "month-year"
  | "long";

export type DateProps = {
  value?: Date | string;
  onChange?: (date: Date) => void;
  format?: FormatType;
};

export default function DateInput({
  value = new Date(),
  onChange,
  format = "long",
}: DateProps) {
  const currentDate = value instanceof Date ? value : new Date(value);

  const handleDateChange = (direction: -1 | 1) => {
    const newDate = new Date(currentDate);

    switch (format) {
      case "year":
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;

      case "month":
      case "month-year":
        newDate.setMonth(newDate.getMonth() + direction);
        break;

      case "week":
        newDate.setDate(newDate.getDate() + direction * 7);
        break;

      default:
        newDate.setDate(newDate.getDate() + direction);
        break;
    }

    onChange?.(newDate);
  };

  return (
    <div className="border rounded border-[#292929] w-full px-4 py-2 flex items-center gap-2">
      <IconButton
        icon="angle-left"
        width="25px"
        height="25px"
        stroke={1.5}
        onClick={() => handleDateChange(-1)}
        className="transition-all duration-100 hover:scale-90 outline-0"
      />

      <input
        readOnly
        value={formatDate(currentDate, format)}
        className="outline-0 flex-1 text-center bg-transparent"
      />

      <IconButton
        icon="angle-right"
        width="25px"
        height="25px"
        stroke={1.5}
        onClick={() => handleDateChange(1)}
        className="transition-all duration-100 hover:scale-90 outline-0"
      />
    </div>
  );
}
