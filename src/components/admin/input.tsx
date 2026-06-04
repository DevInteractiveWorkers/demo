"use client";
import { useState } from "react";
import { Icon } from "../icon";
import { IconButton } from "../icon-button";

type BasicInputProps = {
  id?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  disabled?: boolean;
};

type InputProps = (
  | {
      type?: "text" | "email";
      value?: string;
      placeholder?: string;
      example?: string;
    }
  | {
      type: "textarea";
      value?: string;
      onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
      placeholder?: string;
      example?: string;
    }
  | {
      type: "password";
      value?: string;
      placeholder?: string;
      example?: string;
      secret?: boolean;
    }
  | {
      type: "select";
      selected?: string;
      placeholder?: string;
      example?: string;
      options: { name: string; value: any }[];
      onSelect?: (option: { name: string; value: any }) => void;
    }
  | {
      type: "switch";
      checked?: boolean;
      label?: string | [string, string];
    }
) &
  BasicInputProps;

export default function Input(props: InputProps) {
  const { required, disabled } = props;

  const Required = () => {
    if (required)
      return (
        <>
          {" "}
          <span className="text-[#C2272D]">*</span>
        </>
      );
  };

  switch (props.type) {
    case "switch": {
      const { id, label, checked, onChange } = props;
      return (
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            {label && Array.isArray(label) && (
              <span className="text-white">{label[0]}</span>
            )}
            <div className="relative w-16 h-9">
              {/* ✅ peer MUST come first */}
              <input
                id={id}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className="peer absolute w-full h-full opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed"
              />
              {/* ✅ track */}
              <div className="absolute inset-0 rounded-full border border-[#404040] transition-all duration-200 peer-checked:border-[#606060] peer-checked:bg-[#606060]/50 peer-disabled:bg-[#404040] peer-disabled:opacity-50" />
              {/* ✅ thumb */}
              <div className="absolute top-1 left-1 h-7 w-7 rounded-full bg-[#404040] transition-all duration-200 peer-checked:bg-white peer-checked:translate-x-7 peer-active:scale-90" />
            </div>
            {label && (
              <span className="text-white">
                {Array.isArray(label) ? label[1] : label}
                <Required />
              </span>
            )}
          </label>
        </div>
      );
    }
    // default or text
    case "password": {
      const { id, value, placeholder, example, onChange, secret } = props;
      const [revealed, setRevealed] = useState<boolean>(!secret);
      return (
        <div className="w-full">
          <label className="w-full">
            {placeholder} <Required />
          </label>
          <div className="w-full relative flex justify-center">
            <input
              type={revealed ? "text" : "password"}
              id={id}
              value={value}
              onChange={onChange}
              placeholder={example}
              required={props.required}
              className={`border rounded border-[#292929] w-full px-4 py-2 ${value === "" && example && "opacity-50"}`}
            />
            <IconButton
              filled
              stroke={0}
              className="absolute top-0 right-0 translate-y-1/2 h-full flex pr-4 z-10"
              onClick={() => setRevealed(!revealed)}
              icon={revealed ? "eye-crossed-out" : "eye"}
              height="25"
              width="25"
            />
          </div>
        </div>
      );
    }
    case "textarea": {
      const { id, value, placeholder, example, onChange } = props;
      return (
        <div className="w-full">
          <label className="w-full">
            {placeholder} <Required />
          </label>
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={example}
            required={props.required}
            className="border rounded border-[#292929] w-full px-4 py-2"
          />
        </div>
      );
    }
    case "select": {
      const { id, options, selected, placeholder, example, onSelect } = props;

      const [isOpen, setIsOpen] = useState(false);

      const [search, setSearch] = useState(selected ?? "");

      const filteredOptions = options.filter((option) =>
        option.name.toLowerCase().includes(search.toLowerCase()),
      );

      return (
        <div className="w-full relative">
          <label className="w-full">
            {placeholder} <Required />
          </label>

          <div className="w-full relative flex items-center">
            <input
              id={id}
              value={search || ""}
              placeholder={example}
              required={props.required}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsOpen(true);
              }}
              className="border rounded border-[#292929] w-full px-4 py-2"
            />

            <IconButton
              filled
              stroke={0}
              className="absolute top-1/2 right-0 -translate-y-1/2 flex pr-4 z-10"
              icon="angle-down"
              height="6"
              width="10"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>

          {isOpen && (
            <ul
              onMouseLeave={() => setIsOpen(false)}
              className="border rounded border-[#292929] w-full max-h-60 overflow-y-auto absolute z-10 bg-[#191919] top-full left-0"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, i) => (
                  <li
                    key={i}
                    className={`px-4 py-2 cursor-pointer hover:bg-[#292929] ${option.name === selected && "bg-[#C2272D]"}`}
                    onClick={() => {
                      setSearch(option.name);
                      setIsOpen(false);

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
    default: {
      const { id, type, value, placeholder, example, onChange } = props;
      return (
        <div className="w-full">
          <label className="w-full">
            {placeholder} <Required />
          </label>
          <input
            id={id}
            value={value}
            type={type ?? "text"}
            onChange={onChange}
            placeholder={example}
            required={props.required}
            className="border rounded border-[#292929] w-full px-4 py-2"
          />
        </div>
      );
    }
  }
}
