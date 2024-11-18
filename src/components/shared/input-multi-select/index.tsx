import React from "react";
import Select from "react-select";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label?: string;
  name: string;
  options: Option[];
  error?: string;
  helperText?: string;
  className?: string;
}

const InputMultiSelect: React.FC<MultiSelectProps> = ({
  label,
  name,
  options,
  error,
  helperText,
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}

      <div>
        <Select
          name={name}
          isMulti
          options={options}
          className={`basic-multi-select ${className}`}
          classNamePrefix="select"
        />
      </div>

      {(error || helperText) && (
        <span className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default InputMultiSelect;
