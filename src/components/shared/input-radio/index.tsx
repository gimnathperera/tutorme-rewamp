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
    <div className="flex flex-col">
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={() => field.onChange(option.value)}
                  className={cn(
                    "h-4 w-4 accent-primary-600",
                    error && "ring-1 ring-red-500",
                    className
                  )}
                  {...props}
                />
                <span className="text-sm text-gray-900">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      />

      {/* Reserved space → matches InputText */}
      <span className="mt-1 min-h-[1.25rem] text-xs text-red-500">
        {error || helperText || ""}
      </span>
    </div>
  );
};

export default RadioGroup;
