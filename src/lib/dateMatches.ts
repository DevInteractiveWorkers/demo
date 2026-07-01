import { DateMode } from "@/components/admin/input/calendar-input";

export type DateRange = {
  start: Date;
  end: Date;
};

function toDate(value: any): Date {
  if (value instanceof Date) return value;

  if (value?.toDate) return value.toDate();

  if (value?.seconds) {
    return new Date(value.seconds * 1000);
  }

  return new Date(value);
}

export function dateMatches(
  candidateDate: any,
  selected: Date | DateRange,
  mode: DateMode,
) {
  const candidate = toDate(candidateDate);

  switch (mode) {
    case "date": {
      const date = toDate(selected as Date);

      return (
        candidate.getFullYear() === date.getFullYear() &&
        candidate.getMonth() === date.getMonth() &&
        candidate.getDate() === date.getDate()
      );
    }

    case "week": {
      const date = toDate(selected as Date);

      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

      const end = new Date(start);
      end.setDate(end.getDate() + 7);

      return candidate >= start && candidate < end;
    }

    case "month": {
      const date = toDate(selected as Date);

      return (
        candidate.getFullYear() === date.getFullYear() &&
        candidate.getMonth() === date.getMonth()
      );
    }

    case "year": {
      const date = toDate(selected as Date);

      return candidate.getFullYear() === date.getFullYear();
    }

    case "range": {
      const { start, end } = selected as DateRange;

      const startDate = toDate(start);
      const endDate = toDate(end);

      // Normalize time
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const min = startDate <= endDate ? startDate : endDate;

      const max = startDate <= endDate ? endDate : startDate;

      return candidate >= min && candidate <= max;
    }

    default:
      return true;
  }
}
