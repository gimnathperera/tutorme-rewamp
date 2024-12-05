import { cn } from "@/lib/utils";
import { getNestedError } from "@/utils/form";
import { FC, InputHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  options: RadioOption[];
  name: string;
  helperText?: string;
}

const RadioGroup: FC<RadioGroupProps> = ({
  label,
  options,
  name,
  helperText,
  className = "",
  ...props
}) => {
  const { control, formState } = useFormContext();

  const error = getNestedError(formState.errors, name);

  return (
    <div className="flex flex-col gap-4">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            {options.map((option, index) => (
              <div className="flex items-center gap-x-3" key={index}>
                <input
                  id={`${name}-${option.value}`}
                  type="radio"
                  value={option.value}
                  className={cn(
                    "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600",
                    error ? "border-red-500" : "border-gray-300",
                    className
                  )}
                  checked={field.value === option.value}
                  onChange={(e) => field.onChange(e.target.value)} // Sync with Controller
                  {...props}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {option.label}
                </label>
              </div>
            ))}
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

export default RadioGroup;
