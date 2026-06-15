import { useState } from "react";
import { BasicInputProps, Required } from "./input";
import { Icon } from "@/components/icons/icon";
import { IconButton } from "@/components/icons/icon-button";

export type SelectProps = ({
  type: "select";
  placeholder?: string;
  example?: string;
  options: { name: string; value: any }[];
  onSelect?: (option: { name: string; value: any }) => void;
  onRemove?: (option: { name: string; value: any }) => void;
} & (
  | {
      multiple: true;
      selected?: string[];
    }
  | {
      multiple?: false;
      selected?: string;
    }
)) &
  BasicInputProps;

export default function Select(props: SelectProps) {
  const {
    id,
    options,
    selected,
    multiple,
    placeholder,
    example,
    onSelect,
    onRemove,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptionsOpen, setSelectedOptionsOpen] = useState(false);
  const [search, setSearch] = useState(multiple ? "" : (selected ?? ""));

  const selectedValues = Array.isArray(selected)
    ? selected
    : selected
      ? [selected]
      : [];

  const isTyping = !multiple && search.trim() !== "" && search !== selected;

  const filteredOptions = [...options]
    .filter((option) =>
      multiple ? !selectedValues.includes(option.value) : true,
    )
    .sort((a, b) => {
      if (!search.trim()) return 0;

      const searchLower = search.toLowerCase();

      const aStarts = a.name.toLowerCase().startsWith(searchLower);
      const bStarts = b.name.toLowerCase().startsWith(searchLower);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      const aIncludes = a.name.toLowerCase().includes(searchLower);
      const bIncludes = b.name.toLowerCase().includes(searchLower);

      if (aIncludes && !bIncludes) return -1;
      if (!aIncludes && bIncludes) return 1;

      return a.name.localeCompare(b.name);
    })
    .filter((option) => {
      // Single select:
      // Only filter while typing a value different from selected
      if (!multiple && isTyping) {
        return option.name.toLowerCase().includes(search.toLowerCase());
      }

      return true;
    });

  const selectedLabels = options
    .filter((o) => selectedValues.includes(o.value))
    .map((o) => o.name);

  const [displayValue, setDisplayValue] = useState("");

  return (
    <div className="w-full relative" onMouseLeave={() => setIsOpen(false)}>
      <label className="w-full">
        {placeholder}
        {props.required && <Required />}
      </label>

      <div className="relative border border-[#292929] rounded min-h-10.5 px-3 py-2 flex items-center gap-2 focus-within:outline-1">
        <div className="flex flex-wrap w-full gap-1">
          <input
            id={id}
            value={search}
            placeholder={selectedValues.length ? "" : example}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            className="flex-1 min-w-35 bg-transparent outline-none placeholder-shown:opacity-50 w-full gap-2"
          />

          {multiple && (
            <SelectedOptionsWrap
              options={options.filter((o) => selectedValues.includes(o.value))}
              onRemove={onRemove}
            />
          )}
        </div>

        <IconButton
          filled
          stroke={0}
          width="6"
          height="6"
          icon="angle-down"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <ul
          onMouseLeave={() => setIsOpen(false)}
          className="border rounded border-[#393939] w-full max-h-60 overflow-y-auto absolute z-10 bg-[#292929] top-full left-0
          shadow-[0_10px_10px_10px_rgb(25,25,25,0.5)]"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, i) => (
              <li
                key={i}
                className={`px-4 py-2 cursor-pointer ${
                  selected === option.name
                    ? "bg-[#C2272D]"
                    : " hover:bg-[#393939] "
                }`}
                onClick={() => {
                  if (!multiple) {
                    setSearch(option.name);
                    setIsOpen(false);
                  } else {
                    setSearch("");
                  }
                  setDisplayValue("");
                  onSelect?.(option);
                }}
              >
                {option.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 opacity-50">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
const SelectedOptionsWrap = ({
  options,
  onRemove,
}: {
  options: any[];
  onRemove?: (option: any) => void;
}) => {
  const length = options.length;
  const [wrapOpen, setWrapOpen] = useState(false);

  return (
    <>
      {options.slice(0, wrapOpen ? length : 3).map((option) => (
        <span
          key={option.value}
          className="shrink-0 px-3 py-1 rounded-full text-xs bg-[#292929] hover:bg-[#393939] flex items-center gap-2"
        >
          {option.name}

          <IconButton
            icon="close"
            height="12"
            width="12"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(option);
            }}
          />
        </span>
      ))}

      {length > 3 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setWrapOpen(!wrapOpen);
          }}
          className="shrink-0 px-3 py-1 rounded-full text-xs bg-[#292929] hover:bg-[#393939] flex items-center gap-2"
        >
          {wrapOpen ? "See Less -" : "See More +"}
        </button>
      )}
    </>
  );
};
