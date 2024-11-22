import { getNestedError } from "@/util/form";
import { FC, SelectHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface Option {
  label: string;
  value: string | number;
}

interface InputSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  options: Option[];
  name: string;
}

const InputSelect: FC<InputSelectProps> = ({
  label,
  helperText,
  options,
  name,
  className = "",
  ...props
}) => {
  const { control, formState } = useFormContext();

  const error = getNestedError(formState.errors, name);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className={`block w-full rounded-md border px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
              error ? "ring-red-500" : "ring-gray-300"
            } focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`}
            {...props}
          >
            <option value="">Select an option</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

export default InputSelect;
