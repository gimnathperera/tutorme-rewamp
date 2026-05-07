"use client";

/* eslint-disable unused-imports/no-unused-vars */

import * as React from "react";
import { forwardRef, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatePickerProps {
  id?: string;
  value?: string;
  onChange: (date: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  maxDate?: Date;
}

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const formatDateValue = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const parseDateValue = (value?: string) => {
  if (!value) return null;

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  const [, year, month, day] = match;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ error, className, ...props }, ref) => (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        readOnly
        aria-invalid={!!error}
        className={cn(
          "h-11 cursor-pointer border-gray-300 bg-white pr-10 text-sm text-gray-900 placeholder:text-gray-500",
          error && "border-red-500",
          className,
        )}
      />
      <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  ),
);

CustomInput.displayName = "CustomInput";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1899 }, (_, index) =>
  String(currentYear - index),
);

function DatePickerHeader({
  date,
  changeMonth,
  changeYear,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  onVisibleMonthChange,
  maxDate,
}: {
  date: Date;
  changeMonth: (month: number) => void;
  changeYear: (year: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  onVisibleMonthChange: (date: Date) => void;
  maxDate?: Date;
}) {
  const [openMenu, setOpenMenu] = useState<"month" | "year" | null>(null);
  const selectedMonth = date.getMonth();
  const selectedYear = date.getFullYear();
  const maxYear = maxDate?.getFullYear();
  const filteredYears = maxYear
    ? YEARS.filter((year) => Number(year) <= maxYear)
    : YEARS;

  const closeMenu = () => setOpenMenu(null);

  useEffect(() => {
    onVisibleMonthChange(new Date(selectedYear, selectedMonth, 1));
  }, [onVisibleMonthChange, selectedMonth, selectedYear]);

  return (
    <div className="relative mb-3 flex h-10 items-center justify-center rounded-lg bg-gray-50 px-1">
      <button
        type="button"
        onClick={() => {
          closeMenu();
          decreaseMonth();
        }}
        disabled={prevMonthButtonDisabled}
        className="absolute left-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-white hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center gap-1.5">
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenMenu((current) => (current === "month" ? null : "month"))
            }
            className="flex h-8 items-center gap-1 rounded-md px-2 text-sm font-semibold text-gray-900 transition hover:bg-white focus:bg-white focus:outline-none"
            aria-expanded={openMenu === "month"}
            aria-haspopup="listbox"
          >
            {MONTHS[selectedMonth]}
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </button>

          {openMenu === "month" && (
            <div className="absolute left-1/2 top-9 z-[10000] w-36 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
              <div className="max-h-56 overflow-y-auto">
                {MONTHS.map((month, index) => {
                  const isSelected = index === selectedMonth;

                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => {
                        changeMonth(index);
                        closeMenu();
                      }}
                      className={cn(
                        "flex h-8 w-full items-center justify-between rounded-md px-2 text-left text-sm text-gray-700 transition hover:bg-gray-50",
                        isSelected &&
                          "bg-primary-50 font-semibold text-primary-600 hover:bg-primary-50",
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {month}
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenMenu((current) => (current === "year" ? null : "year"))
            }
            className="flex h-8 items-center gap-1 rounded-md px-2 text-sm font-semibold text-gray-900 transition hover:bg-white focus:bg-white focus:outline-none"
            aria-expanded={openMenu === "year"}
            aria-haspopup="listbox"
          >
            {selectedYear}
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </button>

          {openMenu === "year" && (
            <div className="absolute left-1/2 top-9 z-[10000] w-28 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
              <div className="max-h-56 overflow-y-auto">
                {filteredYears.map((year) => {
                  const numericYear = Number(year);
                  const isSelected = numericYear === selectedYear;

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        changeYear(numericYear);
                        closeMenu();
                      }}
                      className={cn(
                        "flex h-8 w-full items-center justify-between rounded-md px-2 text-left text-sm text-gray-700 transition hover:bg-gray-50",
                        isSelected &&
                          "bg-primary-50 font-semibold text-primary-600 hover:bg-primary-50",
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {year}
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          closeMenu();
          increaseMonth();
        }}
        disabled={nextMonthButtonDisabled}
        className="absolute right-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-white hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="Next month"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

const DatePicker: React.FC<DatePickerProps> = ({
  id,
  value,
  onChange,
  label,
  required,
  error,
  placeholder = "Select date",
  className,
  inputClassName,
  maxDate,
}) => {
  const selectedDate = parseDateValue(value);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => selectedDate ?? maxDate ?? new Date(),
  );

  const handleDateChange = (date: Date | null) => {
    const isOutsideVisibleMonth =
      !!date &&
      (date.getMonth() !== visibleMonth.getMonth() ||
        date.getFullYear() !== visibleMonth.getFullYear());

    onChange(date ? formatDateValue(date) : "");

    if (date) {
      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }

    setIsOpen(isOutsideVisibleMonth);
  };

  const handleInputClick = () => {
    setVisibleMonth(selectedDate ?? maxDate ?? new Date());
    setIsOpen(true);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <ReactDatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        maxDate={maxDate ?? new Date()}
        open={isOpen}
        openToDate={visibleMonth}
        onInputClick={handleInputClick}
        onClickOutside={() => setIsOpen(false)}
        renderCustomHeader={({
          date,
          changeMonth,
          changeYear,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <DatePickerHeader
            date={date}
            changeMonth={changeMonth}
            changeYear={changeYear}
            decreaseMonth={decreaseMonth}
            increaseMonth={increaseMonth}
            prevMonthButtonDisabled={prevMonthButtonDisabled}
            nextMonthButtonDisabled={nextMonthButtonDisabled}
            onVisibleMonthChange={setVisibleMonth}
            maxDate={maxDate}
          />
        )}
        customInput={
          <CustomInput
            id={id}
            error={error}
            placeholder={placeholder}
            className={inputClassName}
          />
        }
        wrapperClassName="w-full"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        popperClassName="z-30 [&_.react-datepicker__triangle]:!hidden"
        calendarClassName="
          !w-auto !rounded-xl !border !border-gray-200 !bg-white !p-3 !font-sans !text-gray-900 !shadow-lg
          [&_.react-datepicker__header]:!border-0 [&_.react-datepicker__header]:!bg-white [&_.react-datepicker__header]:!p-0
          [&_.react-datepicker__month-container]:!float-none [&_.react-datepicker__month-container]:!w-[14.75rem]
          [&_.react-datepicker__month]:!m-0 [&_.react-datepicker__month]:!w-full
          [&_.react-datepicker__week]:!grid [&_.react-datepicker__week]:!grid-cols-7 [&_.react-datepicker__week]:!gap-0.5
          [&_.react-datepicker__day-names]:!mb-1.5 [&_.react-datepicker__day-names]:!grid [&_.react-datepicker__day-names]:!grid-cols-7 [&_.react-datepicker__day-names]:!gap-0.5 [&_.react-datepicker__day-names]:!w-full
          [&_.react-datepicker__day-name]:!m-0 [&_.react-datepicker__day-name]:!flex [&_.react-datepicker__day-name]:!h-7 [&_.react-datepicker__day-name]:!w-auto [&_.react-datepicker__day-name]:!items-center [&_.react-datepicker__day-name]:!justify-center [&_.react-datepicker__day-name]:!text-[11px] [&_.react-datepicker__day-name]:!font-medium [&_.react-datepicker__day-name]:!text-gray-600
          [&_.react-datepicker__day]:!m-0 [&_.react-datepicker__day]:!flex [&_.react-datepicker__day]:!h-8 [&_.react-datepicker__day]:!w-8 [&_.react-datepicker__day]:!items-center [&_.react-datepicker__day]:!justify-center [&_.react-datepicker__day]:!rounded-md [&_.react-datepicker__day]:!border [&_.react-datepicker__day]:!border-transparent [&_.react-datepicker__day]:!text-sm [&_.react-datepicker__day]:!font-medium [&_.react-datepicker__day]:!leading-none [&_.react-datepicker__day]:!text-gray-800 [&_.react-datepicker__day]:!transition-colors
          [&_.react-datepicker__day:hover]:!bg-gray-100 [&_.react-datepicker__day:hover]:!text-gray-900
          [&_.react-datepicker__day--outside-month]:!text-gray-400
          [&_.react-datepicker__day--disabled]:!cursor-not-allowed [&_.react-datepicker__day--disabled]:!text-gray-300
          [&_.react-datepicker__day--selected]:!border-primary-500 [&_.react-datepicker__day--selected]:!bg-primary-500 [&_.react-datepicker__day--selected]:!text-white
          [&_.react-datepicker__day--keyboard-selected]:!border-primary-500 [&_.react-datepicker__day--keyboard-selected]:!bg-primary-500 [&_.react-datepicker__day--keyboard-selected]:!text-white
        "
        dayClassName={(date) => {
          const today = new Date();
          const isToday = date.toDateString() === today.toDateString();
          const isSelected =
            !!selectedDate &&
            date.toDateString() === selectedDate.toDateString();
          const isOutsideVisibleMonth =
            date.getMonth() !== visibleMonth.getMonth() ||
            date.getFullYear() !== visibleMonth.getFullYear();

          return cn(
            isOutsideVisibleMonth &&
              !isSelected &&
              "!text-gray-300 hover:!text-gray-500",
            isToday &&
              !isSelected &&
              "!border-primary-200 !bg-primary-50 !text-primary-600",
            isSelected && "!bg-primary-500 !text-white",
          );
        }}
      />
    </div>
  );
};

export default DatePicker;
