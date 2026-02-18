/* eslint-disable unused-imports/no-unused-vars */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import districtsAndCities from "@/configs/districtsAndCities.json";

interface CitySelectProps {
  value: string;
  district: string;
  onChange: (v: string) => void;
}

export default function CitySelect({
  value,
  district,
  onChange,
}: CitySelectProps) {
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  /* ------------------ GET CITIES FOR DISTRICT ------------------ */
  const districtCities = useMemo(() => {
    if (!district) return [];
    const found = districtsAndCities.districts.find((d) => d.name === district);
    return found?.cities || [];
  }, [district]);

  /* ------------------ CLEAR CITY WHEN DISTRICT CHANGES ------------------ */
  useEffect(() => {
    onChange("");
    setFilteredCities([]);
    setShowDropdown(false);
  }, [district, onChange]);

  /* ------------------ FILTER ------------------ */
  const handleInputChange = (input: string) => {
    onChange(input);

    if (!input.trim()) {
      setFilteredCities([]);
      setShowDropdown(false);
      return;
    }

    const matches = districtCities.filter((city) =>
      city.toLowerCase().includes(input.toLowerCase()),
    );

    setFilteredCities(matches);
    setShowDropdown(matches.length > 0);
  };

  const handleSelect = (city: string) => {
    onChange(city);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={district ? "Type the City" : "Select district first"}
        disabled={!district}
      />

      {showDropdown && (
        <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto rounded mt-1 shadow-lg">
          {filteredCities.map((city) => (
            <li
              key={city}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
