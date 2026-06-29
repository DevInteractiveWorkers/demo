"use client";

import { useMemo, useState } from "react";
import Calendar from "./calendar";

export type DateMode = "date" | "week" | "month" | "year" | "range";

export type CalendarInputProps = {
  value: Date;
  viewDate: Date;

  mode?: DateMode;
  availableModes?: DateMode[];
  onModeChange?: (mode: DateMode) => void;

  onNavigate: (date: Date) => void;
  onSelect?: (date: Date) => void;
};

export const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function CalendarInput({
  value,
  viewDate,
  mode = "date",
  availableModes,
  onNavigate,
  onModeChange,
  onSelect,
}: CalendarInputProps) {
  const today = new Date();

  const calendar = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);

    // Monday first
    const startOffset = (firstDay.getDay() + 6) % 7;

    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - startOffset);

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      return {
        date,
        currentMonth: date.getMonth() === month,
      };
    });
  }, [viewDate]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const navigate = (direction: number) => {
    const next = new Date(viewDate);

    switch (mode) {
      case "year":
        next.setFullYear(next.getFullYear() + direction);
        break;

      default:
        next.setMonth(next.getMonth() + direction);
        break;
    }

    onNavigate(next);
  };

  const handleSelect = (date: Date) => {
    switch (mode) {
      case "week": {
        const start = new Date(date);
        start.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        onSelect?.(start);
        break;
      }

      default:
        onSelect?.(date);
    }
  };

  return (
    <Calendar
      mode={mode}
      availableModes={availableModes}
      value={value}
      viewDate={viewDate}
      today={today}
      calendar={calendar}
      isSameDay={isSameDay}
      navigate={navigate}
      onModeChange={onModeChange}
      handleSelect={handleSelect}
    />
  );
}
