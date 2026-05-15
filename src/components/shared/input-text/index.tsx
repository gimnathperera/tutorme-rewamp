import { getNestedError } from "@/utils/form";
import React, { InputHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  name: string;
  reserveHelperSpace?: boolean;
}

const InputText: React.FC<InputTextProps> = ({
  label,
  helperText,
  className = "",
  name,
  onBlur,
  onChange,
  reserveHelperSpace = false,
  ...props
}) => {
  const { control, formState } = useFormContext();
  const error = getNestedError(formState.errors, name);

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-medium leading-6 text-gray-700">
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
              {...props}
              name={field.name}
              ref={field.ref}
              value={field.value ?? ""}
              onChange={(event) => {
                field.onChange(event);
                onChange?.(event);
              }}
              onBlur={(event) => {
                onBlur?.(event);
                field.onBlur();
              }}
              className={`h-11 w-full rounded-md border px-3 text-darkpurple placeholder:text-darkgrey focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-100 ${
                error ? "border-red-500" : "border-linegrey"
              } ${className}`}
            />

            {(error || helperText || reserveHelperSpace) && (
              <span
                className={`mt-1 min-h-4 text-xs ${
                  error ? "text-red-500" : "text-gray-500"
                }`}
              >
                {error || helperText || ""}
              </span>
            )}
          </>
        )}
      />
    </div>
  );
};

export default InputText;
