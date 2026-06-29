"use client";

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
}: CalendarViewProps) {
  const modes = availableModes ?? ["date", "month", "year"];

  const nextMode = () => {
    const index = modes.indexOf(mode);
    return modes[(index + 1) % modes.length];
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
                className={`rounded py-2 relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full hover:after:bg-white/10
                  ${value.getFullYear() === year ? "bg-[#C2272D]" : ""}`}
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
              className={`rounded py-2 relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full hover:after:bg-white/10
                ${
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

                    return (
                      <td key={date.toISOString()} className="text-center p-1">
                        <button
                          onClick={() => handleSelect(date)}
                          className={`
                            w-9 h-9 rounded-full text-sm transition relative flex justify-center items-center

                            ${
                              selected
                                ? "bg-[#C2272D] text-white"
                                : isToday
                                  ? "border border-[#C2272D]"
                                  : ""
                            }

                            ${
                              currentMonth
                                ? "relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full hover:after:bg-white/10"
                                : "opacity-40 relative overflow-hidden after:absolute after:top-0 after:left-0 after:w-full after:h-full hover:after:bg-white/10"
                            }
                          `}
                        >
                          {date.getDate()}
                          {/* {dayHasActivity && <span
                            className={`absolute bottom-1 w-1 h-1 aspect-square rounded-full ${
                              selected ? "bg-white" : "bg-[#C2272D]"
                            }`}
                          />} */}
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
