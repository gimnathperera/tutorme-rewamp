"use client";

import { Controller, useFormContext } from "react-hook-form";

interface NumberStepperProps {
  name: string;
  min?: number;
  max?: number;
  label?: string;
  required?: boolean;
  reserveHelperSpace?: boolean;
  inputClassName?: string;
}

const NumberStepper = ({
  name,
  min = 0,
  max = 999,
  label,
  required = false,
  reserveHelperSpace = false,
  inputClassName = "",
}: NumberStepperProps) => {
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const val =
            typeof field.value === "number" && !isNaN(field.value)
              ? field.value
              : min;

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            if (raw === "") {
              field.onChange(min);
              return;
            }
            const parsed = parseInt(raw, 10);
            if (!isNaN(parsed)) {
              const clamped = Math.min(max, Math.max(min, parsed));
              field.onChange(clamped);
              if (clamped >= 1) clearErrors(name);
            }
          };

          return (
            <>
              {/* Mobile: − [input] + centered layout */}
              <div
                className={`flex sm:hidden h-11 w-full items-center overflow-hidden rounded-md border bg-white ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(min, val - 1);
                    field.onChange(next);
                    if (next >= 1) clearErrors(name);
                  }}
                  disabled={val <= min}
                  className="flex h-full w-10 shrink-0 items-center justify-center border-r border-gray-200 bg-gray-50 text-lg font-semibold text-gray-500 hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                >
                  −
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={val}
                  onChange={handleChange}
                  onBlur={field.onBlur}
                  className="h-full min-w-0 flex-1 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(max, val + 1);
                    field.onChange(next);
                    clearErrors(name);
                  }}
                  disabled={val >= max}
                  className="flex h-full w-10 shrink-0 items-center justify-center border-l border-gray-200 bg-gray-50 text-lg font-semibold text-gray-500 hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Desktop (sm+): plain input matching other form fields */}
              <input
                type="number"
                min={min}
                max={max}
                step={1}
                value={val}
                onChange={handleChange}
                onBlur={field.onBlur}
                className={`hidden sm:block h-11 w-full rounded-md border px-3 text-sm text-gray-900 placeholder:text-gray-500 bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  error ? "border-red-500" : "border-gray-300"
                } ${inputClassName}`}
              />
            </>
          );
        }}
      />
      {(error || reserveHelperSpace) && (
        <p className="text-xs leading-4 text-red-500 min-h-4">{error ?? ""}</p>
      )}
    </div>
  );
};

export default NumberStepper;
