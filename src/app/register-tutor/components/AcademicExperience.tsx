"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/shared/MultiSelect";

import {
  TUTORING_LEVEL_OPTIONS,
  PREFERRED_LOCATION_OPTIONS,
  TUTOR_TYPE_OPTIONS,
  MEDIUM_OPTIONS,
} from "@/configs/register-tutor";

import {
  useFetchGradesQuery,
  useFetchSubjectsForGradesMutation,
} from "@/store/api/splits/grades";
import { useEffect, useMemo, useState } from "react";

/** Shared style tokens – keep in sync with other register-tutor components */
const fieldWrapper = "flex flex-col gap-1";
const inputClass = "h-11";
const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring";
const selectBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";

const AcademicExperience = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const { data: gradeData } = useFetchGradesQuery({ page: 1, limit: 50 });
  const selectedGrades = watch("grades");

  const selectedGradeIds = useMemo<string[]>(() => {
    return Array.isArray(selectedGrades) ? selectedGrades : [];
  }, [selectedGrades]);
  const [fetchSubjectsForGrades] = useFetchSubjectsForGradesMutation();
  const [subjectOptions, setSubjectOptions] = useState<
    { value: string; text: string }[]
  >([]);

  useEffect(() => {
    if (selectedGradeIds.length === 0) {
      setSubjectOptions([]);
      return;
    }

    const loadSubjects = async () => {
      try {
        const res = await fetchSubjectsForGrades({
          gradeIds: selectedGradeIds,
        }).unwrap();

        setSubjectOptions(
          res.subjects.map((s: any) => ({
            value: s.id,
            text: s.title,
          })),
        );
      } catch (error) {
        console.error("Failed to load subjects", error);
        setSubjectOptions([]);
      }
    };

    loadSubjects();
  }, [selectedGradeIds, fetchSubjectsForGrades]);

  return (
    <div className="space-y-8">
      {/* ROW 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={fieldWrapper}>
          <Label>Tutoring Levels *</Label>
          <Controller
            name="tutoringLevels"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={TUTORING_LEVEL_OPTIONS}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                hasError={!!errors.tutoringLevels}
              />
            )}
          />
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.tutoringLevels?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label>Preferred Locations *</Label>
          <Controller
            name="preferredLocations"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={PREFERRED_LOCATION_OPTIONS}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                hasError={!!errors.preferredLocations}
              />
            )}
          />
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.preferredLocations?.message as string}
          </p>
        </div>
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={fieldWrapper}>
          <Label>Tutor Types *</Label>
          <Controller
            name="tutorType"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={TUTOR_TYPE_OPTIONS}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                hasError={!!errors.tutorType}
              />
            )}
          />
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.tutorType?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label>Highest Education Level *</Label>
          <select
            {...register("highestEducation")}
            className={`${selectClass} ${selectBorder(!!errors.highestEducation)}`}
          >
            <option value="">Select</option>
            <option value="PhD">PhD</option>
            <option value="Masters">Master&apos;s Degree</option>
            <option value="Bachelor Degree">Bachelor&apos;s Degree</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Diploma and Professional">
              Diploma and Professional
            </option>
            <option value="AL">Advanced Level (A/L)</option>
          </select>
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.highestEducation?.message as string}
          </p>
        </div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={fieldWrapper}>
          <Label>Years of Experience *</Label>
          <Input
            type="number"
            min={0}
            max={100}
            className={`${inputClass} ${errors.yearsExperience ? "border-red-500" : "border-gray-300"}`}
            {...register("yearsExperience", { valueAsNumber: true })}
          />
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.yearsExperience?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label>Tutor Mediums *</Label>
          <Controller
            name="tutorMediums"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={MEDIUM_OPTIONS}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                hasError={!!errors.tutorMediums}
              />
            )}
          />
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.tutorMediums?.message as string}
          </p>
        </div>
      </div>

      {/* ROW 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={fieldWrapper}>
          <Label>Grades *</Label>
          <Controller
            name="grades"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={
                  gradeData?.results?.map((g: any) => ({
                    value: g.id,
                    text: g.title,
                  })) || []
                }
                defaultSelected={field.value || []}
                onChange={field.onChange}
                hasError={!!errors.grades}
              />
            )}
          />
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.grades?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label>Subjects *</Label>
          <Controller
            name="subjects"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={subjectOptions}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                hasError={!!errors.subjects}
              />
            )}
          />
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.subjects?.message as string}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcademicExperience;
