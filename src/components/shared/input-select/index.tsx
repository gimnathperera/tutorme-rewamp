import { getNestedError } from "@/utils/form";
import { FC, ReactNode, SelectHTMLAttributes } from "react";
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
  required?: boolean;
  loading?: boolean;
  placeholder?: string;
  disablePlaceholder?: boolean;
  reserveHelperSpace?: boolean;
  icon?: ReactNode;
}

const InputSelect: FC<InputSelectProps> = ({
  label,
  helperText,
  options,
  name,
  className = "",
  required = false,
  loading = false,
  placeholder = "Select an option",
  disablePlaceholder = true,
  reserveHelperSpace = false,
  disabled: isDisabled,
  icon,
  ...props
}) => {
  const { control, formState } = useFormContext();

  const error = getNestedError(formState.errors, name);

  return (
    <div className={`flex flex-col gap-1 ${isDisabled ? "opacity-50" : ""}`}>
      {label && (
        <label className="text-sm font-medium leading-6 text-gray-700">
          {label.includes("*") ? (
            <>
              {label.replace(" *", "")}
              <span className="text-red-500"> *</span>
            </>
          ) : (
            <>
              {label}
              {required && <span className="text-red-500"> *</span>}
            </>
          )}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            {icon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  {icon}
                </div>
              </div>
            )}
            <select
              {...field}
              className={`block w-full appearance-none rounded-md border py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 ${
                error ? "border-red-500" : "border-linegrey"
              } sm:leading-6 ${icon ? "pl-11 pr-3" : "px-3"} ${className}`}
              disabled={loading || isDisabled}
              {...props}
            >
              <option
                value=""
                disabled={disablePlaceholder}
                className="text-gray-500"
              >
                {placeholder}
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

      {(error || helperText || reserveHelperSpace) && (
        <span
          className={`min-h-4 text-xs ${
            error ? "text-red-500" : "text-gray-500"
          }`}
        >
          {error || helperText || ""}
        </span>
      )}
    </div>
  );
};

export default InputSelect;
