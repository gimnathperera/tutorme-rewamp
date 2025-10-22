"use client";

import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FindMyTutorForm } from "../schema"; // adjust the import if needed

const TutoringPreferences = () => {
  const { control, watch, setValue, trigger, formState } =
    useFormContext<FindMyTutorForm>();
  const errors = formState.errors;

  const tutoringLevels: string[] = watch("tutoringLevels") || [];
  const preferredLocations: string[] = watch("preferredLocations") || [];

  const [noPreference, setNoPreference] = useState(false);

  const levels = [
    "Pre-School / Montessori",
    "Primary School (Grades 1-5)",
    "Ordinary Level (O/L) (Grades 6-11)",
    "Advanced Level (A/L) (Grades 12-13)",
    "International Syllabus (Cambridge, Edexcel, IB)",
    "Undergraduate",
    "Diploma / Degree",
    "Language (e.g., English, French, Japanese)",
    "Computing (e.g., Programming, Graphic Design)",
    "Music & Arts",
    "Special Skills",
  ];

  const locationsByRegion = useMemo(
    () => ({
      "Western Province": [
        "Kollupitiya (Colombo 3)",
        "Bambalapitiya (Colombo 4)",
        "Havelock Town (Colombo 5)",
        "Wellawatte (Colombo 6)",
        "Cinnamon Gardens (Colombo 7)",
        "Borella (Colombo 8)",
        "Dehiwala",
        "Mount Lavinia",
        "Nugegoda",
        "Rajagiriya",
        "Kotte",
        "Battaramulla",
        "Malabe",
        "Moratuwa",
        "Gampaha",
        "Negombo",
        "Kadawatha",
        "Kiribathgoda",
        "Kelaniya",
        "Wattala",
        "Ja-Ela",
        "Kalutara",
        "Panadura",
        "Horana",
        "Wadduwa",
      ],
      "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
      "Southern Province": ["Galle", "Matara", "Hambantota"],
      "North Western Province": ["Kurunegala", "Puttalam", "Chilaw"],
      "Sabaragamuwa Province": ["Ratnapura", "Kegalle"],
      "Uva Province": ["Badulla", "Bandarawela"],
      "North Central Province": ["Anuradhapura", "Polonnaruwa"],
      "Northern Province": ["Jaffna", "Vavuniya"],
      "Eastern Province": ["Trincomalee", "Batticaloa"],
    }),
    []
  );

  const toggleLevel = (level: string) => {
    const updated = tutoringLevels.includes(level)
      ? tutoringLevels.filter((l) => l !== level)
      : [...tutoringLevels, level];
    setValue("tutoringLevels", updated);
    if (updated.length > 0) trigger("tutoringLevels");
  };

  const toggleLocation = (loc: string) => {
    if (noPreference) return;
    const updated = preferredLocations.includes(loc)
      ? preferredLocations.filter((l) => l !== loc)
      : [...preferredLocations, loc];
    setValue("preferredLocations", updated);
  };

  const handleNoPreference = () => {
    const next = !noPreference;
    setNoPreference(next);
    if (next) setValue("preferredLocations", []);
  };

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-darkpurple mb-6 flex items-center">
            <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">
              2
            </span>
            Tutoring Preferences
          </h2>

          {/* Level and Subjects */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-primary-700 mb-4">
              Level and Subject You Can As Mainly As Possible:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {levels.map((level) => (
                <label
                  key={level}
                  className="flex items-center p-3 border rounded-lg hover:bg-lightblue cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={tutoringLevels.includes(level)}
                    onChange={() => toggleLevel(level)}
                    className="mr-3 text-primary-700 focus:ring-primary-700 rounded"
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
            {errors.tutoringLevels && (
              <p className="text-red-500 text-sm mt-2">
                {errors.tutoringLevels.message as string}
              </p>
            )}
          </div>

          {/* Preferred Tutoring Locations */}
          <div>
            <h3 className="text-lg font-semibold text-primary-700 mb-4">
              Preferred Tutoring Locations:
            </h3>

            {Object.entries(locationsByRegion).map(([region, locations]) => (
              <div key={region} className="mb-6">
                <h4 className="font-semibold text-darkpurple mb-3">
                  {region}:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {locations.map((location) => (
                    <label
                      key={location}
                      className="flex items-center p-2 border rounded hover:bg-lightblue cursor-pointer transition-colors text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={preferredLocations.includes(location)}
                        onChange={() => toggleLocation(location)}
                        disabled={noPreference}
                        className="mr-2 text-primary-700 focus:ring-primary-700 rounded"
                      />
                      <span className={noPreference ? "text-gray-400" : ""}>
                        {location}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* No Preference Option */}
            <div className="mt-6 p-4 bg-lightblue rounded-lg">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={noPreference}
                  onChange={handleNoPreference}
                  className="mr-3 text-primary-700 focus:ring-primary-700 rounded"
                />
                <span className="font-medium text-darkpurple">
                  No Preference
                </span>
              </label>
              <p className="text-sm text-gray-600 mt-1 ml-6">
                Select this if you&apos;re willing to travel to any location in
                Singapore
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutoringPreferences;
