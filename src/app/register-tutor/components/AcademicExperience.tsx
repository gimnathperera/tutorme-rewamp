"use client";

import { useFormContext } from "react-hook-form";
import { FindMyTutorForm } from "../schema";
import RadioGroup from "@/components/shared/input-radio";
import InputMultiLineText from "@/components/shared/input-multi-line-text";
import {
  tutorTypes,
  educationLevels,
  yearsOptions,
  tutorMediums,
} from "../constants";
import MultiSelect from "@/components/shared/MultiSelect";
import {
  useFetchGradesQuery,
  useLazyFetchGradeByIdQuery,
} from "@/store/api/splits/grades";
import { useEffect, useState } from "react";
import React from "react";

const AcademicExperience = () => {
  const { watch, setValue, trigger, formState } =
    useFormContext<FindMyTutorForm>();
  const errors = formState.errors;

  const yearsExperience = watch("yearsExperience") || 0;

  const handleYearsChange = (year: string) => {
    const value = year === "10+" ? 10 : Number(year);
    setValue("yearsExperience", value);
    trigger("yearsExperience");
  };

  const { data: gradesData } = useFetchGradesQuery({ page: 1, limit: 100 });
  const [fetchGradeById] = useLazyFetchGradeByIdQuery();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectedGrades = watch("grades") || [];
  const selectedSubjects = watch("subjects") || [];
  const selectedMediums: string[] = watch("tutorMediums") || [];

  const gradeOptions =
    gradesData?.results?.map((g) => ({
      value: g.id,
      text: g.title,
    })) || [];

  const [subjectOptions, setSubjectOptions] = useState<
    { value: string; text: string }[]
  >([]);

  const toggleMedium = (medium: string) => {
    const updated = selectedMediums.includes(medium)
      ? selectedMediums.filter((m) => m !== medium)
      : [...selectedMediums, medium];

    setValue("tutorMediums", updated);
    trigger("tutorMediums");
  };
  useEffect(() => {
    if (selectedGrades.length === 0) {
      setSubjectOptions([]);
      setValue("subjects", []);
      return;
    }

    const loadSubjects = async () => {
      const allSubjects = [];

      for (const gradeId of selectedGrades) {
        const res = await fetchGradeById(gradeId);
        if (res?.data?.subjects) {
          allSubjects.push(...res.data.subjects);
        }
      }

      const uniqueSubjects = Array.from(
        new Map(allSubjects.map((s) => [s.id, s])).values()
      );

      setSubjectOptions(
        uniqueSubjects.map((s) => ({ value: s.id, text: s.title }))
      );
    };

    loadSubjects();
  }, [fetchGradeById, selectedGrades, setValue]);

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
            {/* Tutor Medium Selection */}
            <div>
              <div className="text-sm mb-2">Select Tutor Medium *</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tutorMediums.map((medium) => (
                  <label
                    key={medium}
                    className="flex items-center p-3 border rounded-lg hover:bg-lightblue cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMediums.includes(medium)}
                      onChange={() => toggleMedium(medium)}
                      className="mr-3 text-primary-700 focus:ring-primary-700 rounded"
                    />
                    <span className="text-sm">{medium}</span>
                  </label>
                ))}
              </div>

              {errors.tutorMediums && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.tutorMediums.message as string}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* Grades Multi Select */}
                <MultiSelect
                  label="Grades *"
                  options={gradeOptions}
                  defaultSelected={selectedGrades}
                  onChange={(values) => {
                    setValue("grades", values);
                    trigger("grades");
                  }}
                />
                {errors.grades && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.grades.message}
                  </p>
                )}
              </div>
              <div>
                {/* Subjects Multi Select */}
                <MultiSelect
                  label="Subjects *"
                  options={subjectOptions}
                  defaultSelected={selectedSubjects}
                  onChange={(values) => {
                    setValue("subjects", values);
                    trigger("subjects");
                  }}
                  disabled={selectedGrades.length === 0}
                />
                {errors.subjects && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subjects.message}
                  </p>
                )}
              </div>
            </div>

            <RadioGroup
              label="Type of Tutor *"
              name="tutorType"
              options={tutorTypes.map((type) => ({ label: type, value: type }))}
              helperText={errors.tutorType?.message as string}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            />

            {/* Years of Teaching Experience */}
            <div>
              <div className="text-sm mb-2">Years of Teaching Experience *</div>
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
                      onChange={() => handleYearsChange(year)}
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
            <RadioGroup
              label="Highest Education Level *"
              name="highestEducation"
              options={educationLevels.map((level) => ({
                label: level,
                value: level,
              }))}
              helperText={errors.highestEducation?.message as string}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            />

            {/* Academic Details */}
            <InputMultiLineText
              label="Academic Details *"
              name="academicDetails"
              placeholder="Field of study, university attended, academic achievements, etc."
              rows={5}
              helperText={errors.academicDetails?.message as string}
            />

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
