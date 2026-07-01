"use client";

import { useMemo, useState } from "react";
import { IconButton } from "@/components/icons/icon-button";
import { useFormatDate } from "@/lib/useFormatDate";
import { DateMode, months, weekDays } from "./calendar-input";

type CalendarViewProps = {
  mode: DateMode;
  availableModes?: DateMode[];

  value: Date;
  viewDate: Date;
  today: Date;

  calendar: {
    date: Date;
    currentMonth: boolean;
  }[];

  isSameDay: (a: Date, b: Date) => boolean;
  navigate: (direction: number) => void;

  onModeChange?: (mode: DateMode) => void;

  handleSelect: (date: Date) => void;
  onRangeSelect?: (start: Date, end: Date) => void;
};

export default function Calendar({
  mode,
  availableModes,
  value,
  viewDate,
  today,
  calendar,
  isSameDay,
  navigate,
  onModeChange,
  handleSelect,
  onRangeSelect,
}: CalendarViewProps) {
  const modes = availableModes ?? ["date", "month", "year"];

  const nextMode = () => {
    const index = modes.indexOf(mode);
    return modes[(index + 1) % modes.length];
  };

  // ---------------- RANGE ----------------

  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const normalize = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const previewEnd = isSelecting && hoverDate ? hoverDate : rangeEnd;

  const orderedRange = useMemo(() => {
    if (!rangeStart || !previewEnd) return null;

    const a = normalize(rangeStart);
    const b = normalize(previewEnd);

    return a <= b ? { start: a, end: b } : { start: b, end: a };
  }, [rangeStart, previewEnd]);

  const inRange = (date: Date) => {
    if (!orderedRange) return false;

    const d = normalize(date);

    return d >= orderedRange.start && d <= orderedRange.end;
  };

  const isRangeStart = (date: Date) =>
    orderedRange && isSameDay(date, orderedRange.start);

  const isRangeEnd = (date: Date) =>
    orderedRange && isSameDay(date, orderedRange.end);

  const onDateClick = (date: Date) => {
    if (mode !== "range") {
      handleSelect(date);
      return;
    }

    if (!isSelecting) {
      setRangeStart(date);
      setRangeEnd(null);
      setHoverDate(date);
      setIsSelecting(true);
      return;
    }

    setRangeEnd(date);
    setHoverDate(date);
    setIsSelecting(false);

    if (rangeStart) {
      const start =
        normalize(rangeStart) <= normalize(date) ? rangeStart : date;

      const end = normalize(rangeStart) <= normalize(date) ? date : rangeStart;

      onRangeSelect?.(start, end);
    }
  };

  const onDateDoubleClick = (date: Date) => {
    if (mode !== "range") return;

    setRangeStart(date);
    setRangeEnd(date);
    setHoverDate(date);
    setIsSelecting(false);

    onRangeSelect?.(date, date);
  };

  return (
    <div className="p-2 w-80">
      <div className="flex items-center justify-between mb-3">
        <IconButton
          icon="angle-left"
          width="22"
          height="22"
          stroke={1.5}
          onClick={() => navigate(-1)}
        />

        <div className="flex flex-col items-center">
          <button
            className="font-medium px-2 rounded relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full hover:after:bg-white/10"
            onClick={() => onModeChange?.(nextMode())}
          >
            {mode === "year"
              ? useFormatDate(viewDate, "year")
              : mode === "month"
                ? useFormatDate(viewDate, "month")
                : useFormatDate(viewDate, "month-year")}
          </button>

          <span className="text-[10px] opacity-50 uppercase">{mode}</span>
        </div>

        <IconButton
          icon="angle-right"
          width="22"
          height="22"
          stroke={1.5}
          onClick={() => navigate(1)}
        />
      </div>

      {mode === "year" && (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => {
            const year = Math.floor(viewDate.getFullYear() / 9) * 9 + i;

            return (
              <button
                key={year}
                className={`rounded py-2 relative overflow-hidden after:absolute after:inset-0 hover:after:bg-white/10 ${
                  value.getFullYear() === year ? "bg-[#C2272D]" : ""
                }`}
                onClick={() => {
                  const d = new Date(viewDate);
                  d.setFullYear(year);
                  handleSelect(d);
                }}
              >
                {year}
              </button>
            );
          })}
        </div>
      )}

      {mode === "month" && (
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, i) => (
            <button
              key={month}
              className={`rounded py-2 relative overflow-hidden after:absolute after:inset-0 hover:after:bg-white/10 ${
                value.getMonth() === i &&
                value.getFullYear() === viewDate.getFullYear()
                  ? "bg-[#C2272D]"
                  : ""
              }`}
              onClick={() => {
                const d = new Date(viewDate);
                d.setMonth(i);
                handleSelect(d);
              }}
            >
              {month}
            </button>
          ))}
        </div>
      )}

      {(mode === "date" || mode === "week" || mode === "range") && (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th key={day} className="text-xs font-medium opacity-60 pb-2">
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, week) => (
              <tr key={week}>
                {calendar
                  .slice(week * 7, week * 7 + 7)
                  .map(({ date, currentMonth }) => {
                    const selected = isSameDay(date, value);
                    const isToday = isSameDay(date, today);

                    const start = isRangeStart(date);
                    const end = isRangeEnd(date);
                    const between = inRange(date);

                    return (
                      <td key={date.toISOString()} className="text-center p-1">
                        <button
                          onMouseEnter={() => isSelecting && setHoverDate(date)}
                          onClick={() => onDateClick(date)}
                          onDoubleClick={() => onDateDoubleClick(date)}
                          className={`
                            w-9 h-9 rounded-full text-sm transition relative flex justify-center items-center

                            ${
                              mode === "range" && between
                                ? "bg-[#C2272D]/25"
                                : ""
                            }

                            ${
                              mode === "range" && (start || end)
                                ? "bg-[#C2272D] text-white"
                                : ""
                            }

                            ${
                              mode !== "range" && selected
                                ? "bg-[#C2272D] text-white"
                                : ""
                            }

                            ${
                              !selected && !between && isToday
                                ? "border border-[#C2272D]"
                                : ""
                            }

                            ${
                              currentMonth
                                ? "relative overflow-hidden after:absolute after:inset-0 hover:after:bg-white/10"
                                : "opacity-40 relative overflow-hidden after:absolute after:inset-0 hover:after:bg-white/10"
                            }
                          `}
                        >
                          {date.getDate()}
                        </button>
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-end">
        <p className="text-xs opacity-50">
          Week: {useFormatDate(value, "week")}
        </p>
      </div>
    </div>
  );
}
