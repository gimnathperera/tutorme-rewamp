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
  loading?: boolean; // New prop for loading state
}

const InputSelect: FC<InputSelectProps> = ({
  label,
  helperText,
  options,
  name,
  className = "",
  loading = false,
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
          <div className="relative">
            <select
              {...field}
              className={`block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                error ? "border-red-500" : "border-linegrey"
              } sm:leading-6 ${className}`}
              disabled={loading}
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
            {loading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 16 0 8 8 0 0 1-16 0z"
                  />
                </svg>
              </div>
            )}
          </div>
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
