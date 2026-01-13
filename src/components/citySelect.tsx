"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface CitySelectProps {
  value: string;
  onChange: (v: string) => void;
}

export default function CitySelect({ value, onChange }: CitySelectProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("lk_cities");

    if (cached) {
      setCities(JSON.parse(cached));
      return;
    }

    const fetchCities = async () => {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "Sri Lanka" }),
        },
      );

      const data = await res.json();

      if (!data.error) {
        setCities(data.data);
        localStorage.setItem("lk_cities", JSON.stringify(data.data));
      }
    };

    fetchCities();
  }, []);

  const handleInputChange = (input: string) => {
    onChange(input);
    if (input.trim() === "") {
      setFilteredCities([]);
      setShowDropdown(false);
      return;
    }
    const filtered = cities.filter((c) =>
      c.toLowerCase().includes(input.toLowerCase()),
    );
    setFilteredCities(filtered);
    setShowDropdown(filtered.length > 0);
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
        placeholder="Type the City"
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
