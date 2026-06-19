import Button from "../button";
import Input from "../input/input";
import { FormatType } from "../input/date";

const DateOptions = [
  { name: "Week View", value: "week" },
  { name: "Month View", value: "month" },
  { name: "Year View", value: "year" },
];

export default function DateFilter({
  date,
  setDate,
  format,
  setFormat,
}: {
  date: Date;
  setDate: (date: Date) => void;
  format: { name: string; value: FormatType };
  setFormat: (format: { name: string; value: FormatType }) => void;
}) {
  return (
    <div className="flex gap-2">
      <Button onClick={() => setDate(new Date())}>Today</Button>

      <Input
        type="date"
        value={date}
        onChange={setDate}
        format={format.value}
      />

      <Input
        type="select"
        selected={format.value}
        options={DateOptions}
        onSelect={(option) => setFormat(option)}
      />
    </div>
  );
}
