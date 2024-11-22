import { getNestedError } from "@/util/form";
import React, { InputHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  name: string;
}

const InputText: React.FC<InputTextProps> = ({
  label,
  helperText,
  className = "",
  name,
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
          <>
            <input
              {...field}
              className={`relative block w-full appearance-none rounded-md border border-linegrey px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm  ${
                error ? "border-red-500" : "border-gray-300"
              } ${className}`}
              {...props} // Spread other props to the input element
            />
            {(error || helperText) && (
              <span
                className={`text-xs ${
                  error ? "text-red-500" : "text-gray-500"
                }`}
              >
                {error || helperText}
              </span>
            )}
          </>
        )}
      />
    </div>
  );
};

export default InputText;
