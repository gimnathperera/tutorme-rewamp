import { cn } from "@/lib/utils";
import { FC, InputHTMLAttributes } from "react";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  options: RadioOption[];
  name: string;
  error?: string;
  helperText?: string;
}

const RadioGroup: FC<RadioGroupProps> = ({
  label,
  options,
  name,
  error,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-4">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}

      <div className="space-y-3">
        {options.map((option, index) => (
          <div className="flex items-center gap-x-3" key={index}>
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              className={cn(
                "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600",
                className
              )}
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

      {(error || helperText) && (
        <span className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default RadioGroup;
