"use client";

import MultiSelect from "@/components/shared/MultiSelect";

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
  const options = districts.map((d) => ({ value: d, text: d }));

  return (
    <div className="w-full">
      <MultiSelect
        options={options}
        defaultSelected={value ? [value] : []}
        onChange={(selected) => onChange(selected[0] ?? "")}
        hasError={hasError}
        singleSelect
        placeholder={placeholder}
        searchable
      />
    </div>
  );
}
