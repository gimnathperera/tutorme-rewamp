import React, { useState, useRef, useEffect } from "react";

export interface Option {
  value: string;
  text: string;
  selected?: boolean;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  onChange,
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    defaultSelected.length > 0
      ? defaultSelected
      : options.filter((o) => o.selected).map((o) => o.value)
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    const newSelectedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((v) => v !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelectedOptions);
    if (onChange) onChange(newSelectedOptions);
  };

  const removeOption = (value: string) => {
    const newSelectedOptions = selectedOptions.filter((v) => v !== value);
    setSelectedOptions(newSelectedOptions);
    if (onChange) onChange(newSelectedOptions);
  };

  const selectedValuesText = selectedOptions.map(
    (value) => options.find((o) => o.value === value)?.text || ""
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full overflow-visible" ref={dropdownRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className="relative w-full">
        <div
          className={`flex flex-wrap items-center gap-2 w-full cursor-pointer border rounded-lg py-1.5 pl-3 pr-2 shadow-sm ${
            disabled
              ? "bg-gray-100 cursor-not-allowed dark:bg-gray-800"
              : "bg-white dark:bg-gray-900"
          }`}
          onClick={toggleDropdown}
        >
          {selectedValuesText.length > 0 ? (
            selectedValuesText.map((text, index) => (
              <div
                key={index}
                className="flex items-center gap-1 rounded-full bg-gray-100 py-1 px-2 text-sm text-gray-800 dark:bg-gray-800 dark:text-white"
              >
                <span>{text}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(selectedOptions[index]);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-400">Select option</span>
          )}

          <div className="ml-auto">
            <button
              type="button"
              className="w-5 h-5 text-gray-700 dark:text-gray-400"
            >
              ▼
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`cursor-pointer p-2 text-gray-800 dark:text-white hover:bg-primary/10 dark:hover:bg-gray-800 ${
                  selectedOptions.includes(option.value)
                    ? "bg-primary/20 dark:bg-gray-700"
                    : ""
                }`}
              >
                {option.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
