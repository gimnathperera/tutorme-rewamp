/* eslint-disable unused-imports/no-unused-vars */

import { Check, ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  options: Option[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  defaultSelected = [],
  onChange,
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    const updated = selectedOptions.includes(value)
      ? selectedOptions.filter((v) => v !== value)
      : [...selectedOptions, value];

    setSelectedOptions(updated);
    onChange?.(updated);
  };

  const removeOption = (value: string) => {
    const updated = selectedOptions.filter((v) => v !== value);
    setSelectedOptions(updated);
    onChange?.(updated);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* CONTROL */}
      <div
        onClick={toggleDropdown}
        className="flex min-h-[44px] w-full items-center flex-wrap gap-2 rounded-md border border-input bg-background px-3 text-sm cursor-pointer"
      >
        {selectedOptions.length > 0 ? (
          selectedOptions.map((value) => {
            const option = options.find((o) => o.value === value);
            return (
              <span
                key={value}
                className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
              >
                {option?.text}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(value);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </span>
            );
          })
        ) : (
          <span className="text-muted-foreground">Select option</span>
        )}

        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
      </div>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-muted"
            >
              <span>{option.text}</span>
              {selectedOptions.includes(option.value) && <Check size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
