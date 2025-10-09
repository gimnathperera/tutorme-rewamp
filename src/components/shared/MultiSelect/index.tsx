import { Check, ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Option {
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

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (optionValue: string) => {
    const newSelectedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((value) => value !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelectedOptions);
    if (onChange) onChange(newSelectedOptions);
  };

  const removeOption = (index: number, value: string) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
    setSelectedOptions(newSelectedOptions);
    if (onChange) onChange(newSelectedOptions);
  };

  const selectedValuesText = selectedOptions.map(
    (value) => options.find((option) => option.value === value)?.text || ""
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
    <div className="w-full" ref={dropdownRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className="relative z-20 inline-block w-full">
        <div className="relative flex flex-col items-center">
          <div
            onClick={toggleDropdown}
            className="w-full mb-2 flex min-h-[2.75rem] rounded-lg border border-gray-300 py-3 px-2 shadow-theme-xs outline-hidden transition focus:border-brand-300 focus:shadow-focus-ring dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-300 flex-wrap items-center"
          >
            {/* Chips container */}
            <div className="flex flex-wrap flex-auto gap-2 pr-5">
              {selectedValuesText.length > 0 ? (
                selectedValuesText.map((text, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800"
                  >
                    <span className="flex-initial max-w-full">{text}</span>
                    <div className="flex flex-row-reverse flex-auto">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(index, selectedOptions[index]);
                        }}
                        className="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400"
                      >
                        ✕
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <input
                  placeholder="Select option"
                  className="w-full h-full p-1 pr-2 text-sm bg-transparent border-0 outline-hidden appearance-none placeholder:text-gray-800 focus:border-0 focus:outline-hidden focus:ring-0 dark:placeholder:text-white/90"
                  readOnly
                  value="Select option"
                />
              )}
            </div>
            {/* Dropdown arrow */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
                className="w-5 h-5 text-gray-700 outline-hidden cursor-pointer focus:outline-hidden dark:text-gray-400"
              >
                <ChevronDown
                  className={
                    isOpen
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />
              </button>
            </div>
          </div>

          {isOpen && (
            <div
              className="absolute left-0 z-40 w-full max-h-60 overflow-y-auto bg-white rounded-lg shadow-sm top-full dark:bg-gray-900 scrollbar-thin"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`hover:bg-primary/5 w-full cursor-pointer border-b border-gray-200 dark:border-gray-800`}
                    onClick={() => handleSelect(option.value)}
                  >
                    <div
                      className={`relative flex w-full items-center p-2 pl-2 ${
                        selectedOptions.includes(option.value)
                          ? "bg-primary/10"
                          : ""
                      }`}
                    >
                      <div className="mx-2 leading-6 text-gray-800 dark:text-white/90 flex justify-between w-full">
                        <span>{option.text}</span>
                        {selectedOptions.includes(option.value) && <Check />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
