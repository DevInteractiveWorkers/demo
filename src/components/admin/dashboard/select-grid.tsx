import Select, { SelectProps } from "../input/select";

export type GridViewOptions = "grid-small" | "grid-large" | "list";

const GridOptions = [
  {
    name: "List",
    value: "list",
    icon: {
      icon: "list",
      stroke: 1.5,
      filled: false,
      width: "24px",
      height: "24px",
    },
  },
  {
    name: "Grid (Small)",
    value: "grid-small",
    icon: {
      icon: "grid",
      filled: true,
      stroke: 0,
      width: "24px",
      height: "24px",
    },
  },
  {
    name: "Grid (Large)",
    value: "grid-large",
    icon: {
      icon: "large-grid",
      filled: true,
      stroke: 0,
      width: "24px",
      height: "24px",
      viewBox: "0 0 20 20",
    },
  },
];

type SelectGridProps = Omit<
  SelectProps & {
    multiple?: false;
    selected?: string;
  },
  "options" | "multiple"
>;

export default function SelectGrid(props: SelectGridProps) {
  const selectedOption =
    GridOptions.find((option) => option.value === props.selected) ??
    GridOptions[0];

  return (
    <Select
      {...props}
      multiple={false}
      icon={{
        ...selectedOption.icon,
        width: "32px",
        height: "32px",
      }}
      options={GridOptions}
    />
  );
}
