import { getNestedError } from "@/utils/form";
import React, { useState, useCallback, InputHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Icon from "../icon";

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  name: string;
}

const InputPassword: React.FC<InputPasswordProps> = React.memo(
  ({ label, helperText, className = "", name, ...props }) => {
    const { control, formState } = useFormContext();
    const [showPassword, setShowPassword] = useState(false);

    const error = getNestedError(formState.errors, name);

    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

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
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                className={`relative block w-full appearance-none rounded-md border px-3 py-[0.625rem] text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                  error ? "border-red-500" : "border-gray-300"
                } ${className}`}
                {...props}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 z-20 px-3 text-gray-500 hover:text-gray-700 focus:outline-none ${
                  error ? "mb-5" : ""
                }`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Icon name="Eye" /> : <Icon name="EyeClosed" />}
              </button>
              {(error || helperText) && (
                <span
                  className={`text-xs ${
                    error ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {error || helperText}
                </span>
              )}
            </div>
          )}
        />
      </div>
    );
  }
);

InputPassword.displayName = "InputPassword";

export default InputPassword;
