import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getNestedError } from "@/utils/form";

interface DatePickerProps {
  label?: string;
  helperText?: string;
  name: string;
  className?: string;
  dateFormat?: string;
  placeholderText?: string;
}

const InputDatePicker: React.FC<DatePickerProps> = ({
  label,
  helperText,
  name,
  className = "",
  dateFormat = "MM/dd/yyyy",
  placeholderText = "Select a date",
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
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              className={`relative block w-full appearance-none rounded-md border px-3 py-[0.625rem] text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm  ${
                error ? "border-red-500" : "border-gray-300"
              } ${className}`}
              dateFormat={dateFormat}
              placeholderText={placeholderText}
              {...props}
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

export default InputDatePicker;
