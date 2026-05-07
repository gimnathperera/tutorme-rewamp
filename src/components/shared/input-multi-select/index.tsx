import React from "react";
import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { getNestedError } from "@/utils/form";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label?: string;
  name: string;
  options: Option[];
  helperText?: string;
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
}

const InputMultiSelect: React.FC<MultiSelectProps> = ({
  label,
  name,
  options,
  helperText,
  className = "",
  isDisabled = false,
  isLoading = false,
  isSearchable = false,
}) => {
  const { control, formState } = useFormContext();

  const error = getNestedError(formState.errors, name);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label.includes("*") ? (
            <>
              {label.replace(" *", "")}
              <span className="text-red-500"> *</span>
            </>
          ) : (
            label
          )}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            isLoading={isLoading}
            isMulti
            isSearchable={isSearchable}
            placeholder="Select an option"
            options={options}
            className={`basic-multi-select ${
              error ? "border-red-500" : "border-gray-300"
            } ${className}`}
            onChange={(selected) =>
              field.onChange(selected.map((option) => option.value))
            }
            value={options.filter((option) =>
              field.value?.includes(option.value),
            )}
            styles={{
              placeholder: (base) => ({
                ...base,
                color: "#6B7280",
                fontSize: "0.875rem",
                marginLeft: "2px",
              }),
              input: (base) => ({
                ...base,
                margin: "0",
                padding: "0",
                caretColor: isSearchable ? "auto" : "transparent",
              }),
              control: (base) => ({
                ...base,
                borderColor: error ? "#EF4444" : "#D1D5DB",
                "&:hover": {
                  borderColor: error ? "#EF4444" : "#D1D5DB",
                },
                padding: "0.2rem",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#6A7280",
              }),
            }}
            isDisabled={isDisabled}
          />
        )}
      />

      {(error || helperText) && (
        <span className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default InputMultiSelect;
