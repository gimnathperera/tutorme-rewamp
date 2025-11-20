"use client";
interface DistrictSelectProps {
  value: string;
  onChange: (v: string) => void;
  districts: string[];
}

export default function DistrictSelect({
  value,
  onChange,
  districts,
}: DistrictSelectProps) {
  return (
    <div className="w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded p-2 w-full"
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
