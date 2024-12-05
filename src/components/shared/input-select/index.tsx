import { getNestedError } from "@/utils/form";
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
            className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
              error ? "border-red-500" : "border-linegrey"
            } sm:leading-6 ${className}`}
            {...props}
          >
            <option value="" className="text-gray-500">
              Select an option
            </option>
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
