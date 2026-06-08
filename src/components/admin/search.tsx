import { Icon } from "../icons/icon";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="border border-[#292929] px-4 py-2 rounded-full flex gap-2 md:w-6/12 sm:w-9/12 w-full">
      <Icon
        icon="search"
        filled
        stroke={0}
        width="25px"
        height="25"
        viewBox="0 0 20 20"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="outline-none bg-transparent w-full"
      />
    </div>
  );
}
