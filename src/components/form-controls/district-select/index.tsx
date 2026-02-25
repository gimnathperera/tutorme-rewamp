/* eslint-disable unused-imports/no-unused-vars */

"use client";
interface DistrictSelectProps {
  value: string;
  onChange: (v: string) => void;
  districts: string[];
  hasError?: boolean;
}

export default function DistrictSelect({
  value,
  onChange,
  districts,
  hasError = false,
}: DistrictSelectProps) {
  const borderClass = hasError ? "border-red-500" : "border-gray-300";

  return (
    <div className="w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 w-full rounded-md border ${borderClass} bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring`}
      >
        <option value="">Select District</option>
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
    </div>
  );
}
