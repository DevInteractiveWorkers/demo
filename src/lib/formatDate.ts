// lib/formatDate.ts

export const formatDate = (
  value: any,
  format:
    | "date"
    | "day"
    | "weekday"
    | "week"
    | "month"
    | "year"
    | "time"
    | "full-date"
    | "month-year"
    | "long" = "date",
) => {
  if (!value) return "";

  let d: Date;

  if (typeof value === "object" && value.toDate) {
    d = value.toDate();
  } else {
    d = new Date(value);
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  switch (format) {
    case "day":
      return day;

    case "weekday":
      return weekdays[d.getDay()];

    case "week": {
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return `${months[start.getMonth()]} ${start.getDate()} - ${
        months[end.getMonth()]
      } ${end.getDate()}, ${end.getFullYear()}`;
    }

    case "month":
      return month;

    case "year":
      return year;

    case "time":
      return `${hh}:${mm}`;

    case "month-year":
      return `${month} ${year}`;

    case "long":
      return `${month} ${day}, ${year}`;

    case "full-date":
      return `${month} ${day}, ${year} • ${hh}:${mm}`;

    default:
      return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(day).padStart(2, "0")}/${String(year).slice(-2)}`;
  }
};
