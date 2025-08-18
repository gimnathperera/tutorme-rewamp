"use client";

import { useFormContext } from "react-hook-form";
import { FindMyTutorForm } from "../schema";
import RadioGroup from "@/components/shared/input-radio";
import InputMultiLineText from "@/components/shared/input-multi-line-text";

const AcademicExperience = () => {
  const { watch, setValue, trigger, formState } =
    useFormContext<FindMyTutorForm>();
  const errors = formState.errors;

  const tutorType = watch("tutorType") || "";
  const yearsExperience = watch("yearsExperience") || 0;
  const highestEducation = watch("highestEducation") || "";
  const academicDetails = watch("academicDetails") || "";

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

  const yearsOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

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
              <RadioGroup
                label="Type of Tutor *"
                name="tutorType"
                options={tutorTypes.map(type => ({ label: type, value: type }))}
                helperText={errors.tutorType?.message as string}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
              />
            </div>

            {/* Years of Teaching Experience */}
            <div>
              <label className="block text-lg font-semibold text-darkpurple mb-4">
                Yrs of Teaching Experience *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {yearsOptions.map((year) => (
                  <label
                    key={year}
                    className="flex items-center justify-center p-3 border rounded-lg hover:bg-lightblue cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      value={year}
                      checked={
                        (year === "10+" && yearsExperience >= 10) ||
                        String(yearsExperience) === year
                      }
                      onChange={() =>
                        setValue("yearsExperience", year === "10+" ? 10 : Number(year))
                      }
                      onBlur={() => trigger("yearsExperience")}
                      className="mr-2 text-primary-700 focus:ring-primary-700"
                    />
                    <span className="font-medium">{year}</span>
                  </label>
                ))}
              </div>
              {errors.yearsExperience && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.yearsExperience.message as string}
                </p>
              )}
            </div>

            {/* Highest Education Level */}
            <div>
              <RadioGroup
                label="Highest Education Level *"
                name="highestEducation"
                options={educationLevels.map(level => ({ label: level, value: level }))}
                helperText={errors.highestEducation?.message as string}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
              />
            </div>

            {/* Academic details text area */}
            <div>
              <InputMultiLineText
                label="Academic Details *"
                name="academicDetails"
                placeholder="Field of study, university attended, academic achievements, etc."
                rows={5}
                helperText={errors.academicDetails?.message as string}
                
              />
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
