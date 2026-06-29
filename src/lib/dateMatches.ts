import { DateMode } from "@/components/admin/input/calendar-input";

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
  selectedDate: Date,
  mode: DateMode,
) {
  const candidate = toDate(candidateDate);
  const selected = toDate(selectedDate);

  switch (mode) {
    case "date":
      return (
        candidate.getFullYear() === selected.getFullYear() &&
        candidate.getMonth() === selected.getMonth() &&
        candidate.getDate() === selected.getDate()
      );

    case "week": {
      const start = new Date(selected);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

      const end = new Date(start);
      end.setDate(end.getDate() + 7);

      return candidate >= start && candidate < end;
    }

    case "month":
      return (
        candidate.getFullYear() === selected.getFullYear() &&
        candidate.getMonth() === selected.getMonth()
      );

    case "year":
      return candidate.getFullYear() === selected.getFullYear();

    default:
      return true;
  }
}
