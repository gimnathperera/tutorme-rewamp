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
  ...props
}) => {
  const { control, formState } = useFormContext();
  const error = getNestedError(formState.errors, name);

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
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
              className={`h-11 w-full rounded-md border px-3 text-darkpurple placeholder:text-darkgrey focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                error ? "border-red-500" : "border-linegrey"
              } ${className}`}
            />

            {/* Reserved space → no layout jump */}
            <span className="mt-1 min-h-[1.25rem] text-xs text-red-500">
              {error || helperText || ""}
            </span>
          </>
        )}
      />
    </div>
  );
};

export default InputText;
