"use client";

import { FindMyTutorRequest } from "@/types/request-types";

type Props = {
  data: FindMyTutorRequest;
  errors: Record<string, string>;
  setField: (name: keyof FindMyTutorRequest, value: any) => void;
  validateField: (name: keyof FindMyTutorRequest) => boolean;
};

const AcademicExperience = ({ data, errors, setField, validateField }: Props) => {
  const tutorTypes = [
    "Full Time Student",
    "Undergraduate",
    "Part Time Tutor",
    "Full Time Tutor",
    "Ex/Current MOE Teacher",
    "Ex-MOE Teacher",
    "Current MOE Teacher",
  ];

  const educationLevels = [
    "PhD Diploma",
    "Masters",
    "Undergraduate",
    "Bachelor Degree",
    "Diploma and Professional",
    "JC/A Levels",
    "Poly",
    "Others",
  ];

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-darkpurple mb-6 flex items-center">
            <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">
              3
            </span>
            Academic Qualifications & Experience
          </h2>

          <div className="space-y-8">
            {/* Type of Tutor */}
            <div>
              <label className="block text-lg font-semibold text-darkpurple mb-4">
                Type of Tutor *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tutorTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center p-3 border rounded-lg hover:bg-lightblue cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="tutorType"
                      value={type}
                      checked={data.tutorType === type}
                      onChange={(e) => setField("tutorType", e.target.value)}
                      onBlur={() => validateField("tutorType")}
                      className="mr-3 text-primary-700 focus:ring-primary-700"
                    />
                    <span className="text-sm font-medium">{type}</span>
                  </label>
                ))}
              </div>
              {errors.tutorType && (
                <p className="text-red-500 text-sm mt-1">{errors.tutorType}</p>
              )}
            </div>

            {/* Years of Teaching Experience */}
            <div>
              <label className="block text-lg font-semibold text-darkpurple mb-4">
                Yrs of Teaching Experience *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map(
                  (years) => (
                    <label
                      key={years}
                      className="flex items-center justify-center p-3 border rounded-lg hover:bg-lightblue cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="yearsExperience"
                        value={years}
                        checked={
                          (years === "10+" && data.yearsExperience >= 10) ||
                          String(data.yearsExperience) === years
                        }
                        onChange={(e) =>
                          setField(
                            "yearsExperience",
                            e.target.value === "10+" ? 10 : Number(e.target.value)
                          )
                        }
                        onBlur={() => validateField("yearsExperience")}
                        className="mr-2 text-primary-700 focus:ring-primary-700"
                      />
                      <span className="font-medium">{years}</span>
                    </label>
                  )
                )}
              </div>
              {errors.yearsExperience && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.yearsExperience}
                </p>
              )}
            </div>

            {/* Highest Education Level */}
            <div>
              <label className="block text-lg font-semibold text-darkpurple mb-4">
                Highest Education Level *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {educationLevels.map((level) => (
                  <label
                    key={level}
                    className="flex items-center p-3 border rounded-lg hover:bg-lightblue cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="highestEducation"
                      value={level}
                      checked={data.highestEducation === level}
                      onChange={(e) =>
                        setField("highestEducation", e.target.value)
                      }
                      onBlur={() => validateField("highestEducation")}
                      className="mr-3 text-primary-700 focus:ring-primary-700"
                    />
                    <span className="text-sm font-medium">{level}</span>
                  </label>
                ))}
              </div>
              {errors.highestEducation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.highestEducation}
                </p>
              )}
            </div>

            {/* Academic details text area */}
            <div>
              <label className="block text-lg font-semibold text-darkpurple mb-4">
                Academic Details *
              </label>
              <textarea
                value={data.academicDetails}
                onChange={(e) => setField("academicDetails", e.target.value)}
                onBlur={() => validateField("academicDetails")}
                rows={5}
                placeholder="Field of study, university attended, academic achievements, etc."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors resize-vertical ${
                  errors.academicDetails ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.academicDetails && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.academicDetails}
                </p>
              )}
            </div>

            <div className="bg-blue p-4 rounded-lg">
              <p className="text-sm text-white">
                <strong>Note:</strong> If you are above School Leaver, please
                kindly indicate your field of study, university attended,
                academic achievements, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicExperience;
