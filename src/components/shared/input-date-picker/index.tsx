"use client";

import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Icon from "@/components/shared/icon";

interface InputDatePickerProps {
  name: string;
  label?: string;
  required?: boolean;
  maxDate?: string;
  helperText?: string;
  reserveHelperSpace?: boolean;
  inputClassName?: string;
}

const toDateString = (date: Date): string =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const InputDatePicker: React.FC<InputDatePickerProps> = ({
  name,
  label,
  required = false,
  maxDate,
  helperText,
  reserveHelperSpace = false,
  inputClassName = "",
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const error = errors[name]?.message as string | undefined;
  const baseInputClass = `h-11 w-full rounded-md border px-3 pr-10 text-sm text-gray-900 bg-transparent focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer caret-transparent ${
    error ? "border-red-500" : "border-gray-300"
  } ${inputClassName}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {/* Desktop (sm+): native date input */}
      <div
        className="relative hidden sm:block cursor-pointer"
        onClick={() => dateInputRef.current?.showPicker()}
      >
        <input
          type="date"
          {...register(name)}
          ref={(el) => {
            register(name).ref(el);
            dateInputRef.current = el;
          }}
          onKeyDown={(e) => e.preventDefault()}
          max={maxDate}
          autoComplete="bday"
          className={`${baseInputClass} pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute`}
        />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <Icon name="Calendar" size={16} />
        </span>
      </div>

      {/* Mobile (< sm): react-datepicker with brand colours */}
      <div className="relative sm:hidden dob-mobile-picker">
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const selectedDate =
              field.value instanceof Date
                ? field.value
                : field.value
                  ? new Date(field.value)
                  : null;
            const validDate =
              selectedDate && !isNaN(selectedDate.getTime())
                ? selectedDate
                : null;
            return (
              <>
                <DatePicker
                  selected={validDate}
                  onChange={(date: Date | null) => {
                    field.onChange(date ? toDateString(date) : "");
                  }}
                  maxDate={maxDate ? new Date(maxDate) : undefined}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  autoComplete="off"
                  onChangeRaw={(e) => e.preventDefault()}
                  className={baseInputClass}
                  wrapperClassName="w-full"
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <Icon name="Calendar" size={16} />
                </span>
              </>
            );
          }}
        />
      </div>

      {(error || helperText || reserveHelperSpace) && (
        <p
          className={`text-xs leading-4 min-h-4 ${
            error ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {error || helperText || ""}
        </p>
      )}
    </div>
  );
};

export default InputDatePicker;
