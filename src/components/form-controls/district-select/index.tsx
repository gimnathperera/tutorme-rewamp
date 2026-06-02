/* eslint-disable unused-imports/no-unused-vars */

"use client";
interface DistrictSelectProps {
  value: string;
  onChange: (v: string) => void;
  districts: string[];
  hasError?: boolean;
  placeholder?: string;
}

export default function DistrictSelect({
  value,
  onChange,
  districts,
  hasError = false,
  placeholder = "Select your district",
}: DistrictSelectProps) {
  const borderClass = hasError ? "border-red-500" : "border-gray-300";

  return (
    <div className="w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "h-11 w-full rounded-md border px-3 text-sm bg-transparent",
          "focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-150",
          value ? "text-gray-900" : "text-gray-500",
          borderClass,
        ].join(" ")}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {districts.map((district) => (
          <option key={district} value={district} className="text-gray-900">
            {district}
          </option>
        ))}
      </select>
    </div>
  );
}
