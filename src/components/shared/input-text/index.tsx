import { getNestedError } from "@/utils/form";
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
  onBlur,
  onChange,
  ...props
}) => {
  const { control, formState } = useFormContext();
  const error = getNestedError(formState.errors, name);

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
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
          <>
            <input
              {...field}
              {...props}
              onChange={(event) => {
                field.onChange(event);
                onChange?.(event);
              }}
              onBlur={(event) => {
                field.onBlur();
                onBlur?.(event);
              }}
              className={`h-11 w-full rounded-md border px-3 text-darkpurple placeholder:text-darkgrey focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                error ? "border-red-500" : "border-linegrey"
              } ${className}`}
            />

            {(error || helperText) && (
              <span className="text-xs text-red-500 mt-1">
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
