/* eslint-disable unused-imports/no-unused-vars */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import districtsAndCities from "@/configs/districtsAndCities.json";

interface CitySelectProps {
  value: string;
  district: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}

/* ── Helpers ── */

/** Levenshtein distance between two strings (case-insensitive). */
function levenshtein(a: string, b: string): number {
  const al = a.toLowerCase();
  const bl = b.toLowerCase();
  const m = al.length;
  const n = bl.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        al[i - 1] === bl[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Returns up to `limit` cities whose edit distance from `query` is ≤ `maxDist`.
 * Sorted by distance (best match first).
 */
function fuzzyMatch(
  query: string,
  cities: string[],
  maxDist = 3,
  limit = 5,
): string[] {
  return cities
    .map((city) => ({ city, dist: levenshtein(query, city) }))
    .filter(({ dist }) => dist <= maxDist)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map(({ city }) => city);
}

export default function CitySelect({
  value,
  district,
  onChange,
  hasError = false,
}: CitySelectProps) {
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  /* ── Cities for the chosen district ── */
  const districtCities = useMemo(() => {
    if (!district) return [];
    const found = districtsAndCities.districts.find((d) => d.name === district);
    return found?.cities || [];
  }, [district]);

  /* ── Derived: exact substring matches ── */
  const exactMatches = useMemo(() => {
    if (!searchText.trim()) return [];
    return districtCities.filter((city) =>
      city.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, districtCities]);

  /* ── Derived: fuzzy suggestions (only when no exact matches) ── */
  const suggestions = useMemo(() => {
    if (!searchText.trim() || exactMatches.length > 0) return [];
    return fuzzyMatch(searchText, districtCities);
  }, [searchText, districtCities, exactMatches]);

  /* ── Clear city when district changes ── */
  useEffect(() => {
    if (!district) {
      setSearchText("");
      setShowDropdown(false);
      return;
    }
    onChange("");
    setSearchText("");
    setShowDropdown(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]);

  /* ── Sync display when value is cleared externally ── */
  useEffect(() => {
    if (!value) setSearchText("");
  }, [value]);

  /* ── Handle typing ── */
  const handleInputChange = (input: string) => {
    setSearchText(input);
    if (!input.trim()) {
      onChange("");
      setShowDropdown(false);
      return;
    }
    setShowDropdown(true);
  };

  /* ── Commit a selection ── */
  const handleSelect = (city: string) => {
    onChange(city);
    setSearchText(city);
    setShowDropdown(false);
  };

  /* ── Blur: revert if user typed something that was never committed ── */
  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      if (searchText !== value) {
        setSearchText(value);
      }
    }, 150);
  };

  const hasExact = exactMatches.length > 0;
  const hasSuggestions = suggestions.length > 0;
  const noResults =
    !hasExact && !hasSuggestions && searchText.trim().length > 0;

  return (
    <div className="relative w-full">
      <Input
        value={searchText}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        onFocus={() => {
          if (searchText.trim()) setShowDropdown(true);
        }}
        placeholder={district ? "Search city..." : "Select district first"}
        disabled={!district}
        autoComplete="off"
        className={`h-11 ${hasError ? "border-red-500" : "border-gray-300"}`}
      />

      {showDropdown && (
        <ul className="absolute z-10 bg-white border border-gray-200 w-full max-h-52 overflow-auto rounded-md mt-1 shadow-lg">
          {/* ── Exact / substring matches ── */}
          {hasExact &&
            exactMatches.map((city) => (
              <li
                key={city}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(city)}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {city}
              </li>
            ))}

          {/* ── Fuzzy suggestions ── */}
          {!hasExact && hasSuggestions && (
            <>
              <li className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide select-none border-b border-gray-100">
                Did you mean?
              </li>
              {suggestions.map((city) => (
                <li
                  key={city}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(city)}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer text-amber-700"
                >
                  {city}
                </li>
              ))}
            </>
          )}

          {/* ── No match at all ── */}
          {noResults && (
            <li className="px-3 py-2 text-sm text-gray-400 select-none">
              No city found for &ldquo;{searchText}&rdquo;
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
