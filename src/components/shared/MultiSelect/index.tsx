/* eslint-disable unused-imports/no-unused-vars */

import { Check, ChevronDown } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  options: Option[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  hasError?: boolean;
  searchable?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  defaultSelected = [],
  onChange,
  disabled = false,
  hasError = false,
  searchable = false,
}) => {
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const visibleOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((o) => o.text.toLowerCase().includes(q));
  }, [options, searchable, searchQuery]);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) setSearchQuery("");
      return next;
    });
  };

  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen, searchable]);

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

  // Sync internal selection state when the parent updates defaultSelected
  // (e.g. when the form filters out subjects after a grade is removed).
  useEffect(() => {
    setSelectedOptions(defaultSelected);
  }, [defaultSelected]);

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

  const borderClass = hasError ? "border-red-500" : "border-gray-300";
  const disabledClass = disabled
    ? "cursor-not-allowed bg-muted/60 text-muted-foreground opacity-70"
    : "cursor-pointer bg-background";

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* CONTROL */}
      <div
        onClick={toggleDropdown}
        aria-disabled={disabled}
        className={`flex min-h-[44px] w-full items-center flex-wrap gap-2 rounded-md border ${borderClass} px-3 text-sm ${disabledClass}`}
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
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (disabled) return;
                    removeOption(value);
                  }}
                  className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
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
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow">
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Search..."
                className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
              />
            </div>
          )}
          <div className="max-h-52 overflow-y-auto">
            {visibleOptions.length > 0 ? (
              visibleOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-muted"
                >
                  <span>{option.text}</span>
                  {selectedOptions.includes(option.value) && <Check size={16} />}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400 select-none">
                No results for &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
