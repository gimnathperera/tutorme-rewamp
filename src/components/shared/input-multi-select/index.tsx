import React from "react";
import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";

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
}

const InputMultiSelect: React.FC<MultiSelectProps> = ({
  label,
  name,
  options,
  helperText,
  className = "",
}) => {
  const { control, formState } = useFormContext();

  const error = formState.errors[name]?.message?.toString();

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

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            isMulti
            options={options}
            className={`basic-multi-select ${
              error ? "ring-red-500" : "ring-gray-300"
            } ${className}`}
            classNamePrefix="select"
            onChange={
              (selected) =>
                field.onChange(selected.map((option) => option.value)) // Sync with form state
            }
            value={options.filter((option) =>
              field.value?.includes(option.value)
            )}
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
