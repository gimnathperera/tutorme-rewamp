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
  // searchText drives the input display; value is the committed (form) value.
  const [searchText, setSearchText] = useState("");
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
    // Only clear when switching to a real district (not when district is emptied on reset)
    if (!district) {
      setSearchText("");
      setFilteredCities([]);
      setShowDropdown(false);
      return;
    }
    onChange("");
    setSearchText("");
    setFilteredCities([]);
    setShowDropdown(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]);

  /* ------------------ SYNC display when value is cleared externally ---------- */
  useEffect(() => {
    if (!value) setSearchText("");
  }, [value]);

  /* ------------------ FILTER on search input ------------------ */
  const handleInputChange = (input: string) => {
    // Update display only — do NOT commit to form yet
    setSearchText(input);
    // If user clears the box, also clear the committed form value
    if (!input.trim()) {
      onChange("");
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

  /* ------------------ SELECT from dropdown (commits to form) -------------- */
  const handleSelect = (city: string) => {
    onChange(city);        // commit real value
    setSearchText(city);   // mirror in display
    setShowDropdown(false);
    setFilteredCities([]);
  };

  /* ------------------ BLUR: reject free text, revert to committed value --- */
  const handleBlur = () => {
    // Short delay so click on dropdown item fires first
    setTimeout(() => {
      setShowDropdown(false);
      // If what the user typed doesn't match the committed value, revert
      if (searchText !== value) {
        setSearchText(value);
      }
    }, 150);
  };

  return (
    <div className="relative w-full">
      <Input
        value={searchText}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={district ? "Search city..." : "Select district first"}
        disabled={!district}
        autoComplete="off"
      />

      {showDropdown && (
        <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-auto rounded mt-1 shadow-lg">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <li
                key={city}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                onClick={() => handleSelect(city)}
              >
                {city}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-400 text-sm">No cities found</li>
          )}
        </ul>
      )}
    </div>
  );
}
