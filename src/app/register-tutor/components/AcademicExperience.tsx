"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/shared/MultiSelect";

import {
  CLASS_TYPE_OPTIONS,
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
const fieldWrapper = "flex flex-col gap-1.5";
const inputClass = "h-11 text-sm placeholder:text-gray-500 text-gray-900";
const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring text-gray-900";
const selectBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";

const AcademicExperience = () => {
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
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
      setValue("subjects", []);
      return;
    }

    const loadSubjects = async () => {
      try {
        const res = await fetchSubjectsForGrades({
          gradeIds: selectedGradeIds,
        }).unwrap();

        const newOptions = res.subjects.map((s: any) => ({
          value: s.id,
          text: s.title,
        }));
        setSubjectOptions(newOptions);

        // Remove any previously selected subjects that no longer belong
        // to the current set of grades.
        const validIds = new Set(newOptions.map((o) => o.value));
        const currentSubjects: string[] = getValues("subjects") ?? [];
        const filtered = currentSubjects.filter((id) => validIds.has(id));
        setValue("subjects", filtered);
      } catch (error) {
        console.error("Failed to load subjects", error);
        setSubjectOptions([]);
      }
    };

    loadSubjects();
  }, [selectedGradeIds, fetchSubjectsForGrades, setValue, getValues]);

  return (
    <div className="space-y-3">
      {/* ROW 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="classType">
            Class Type <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="classType"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={CLASS_TYPE_OPTIONS}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                hasError={!!errors.classType}
              />
            )}
          />
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.classType?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="preferredLocations">
            Preferred Locations <span className="text-red-500">*</span>
          </Label>
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
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.preferredLocations?.message as string}
          </p>
        </div>
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="tutorType">
            Tutor Types <span className="text-red-500">*</span>
          </Label>
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
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.tutorType?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="highestEducation">
            Highest Education Level <span className="text-red-500">*</span>
          </Label>
          <select
            id="highestEducation"
            {...register("highestEducation")}
            className={`${selectClass} ${selectBorder(!!errors.highestEducation)}`}
          >
            <option value="" disabled hidden>
              Select highest education level
            </option>
            <option value="PhD">PhD</option>
            <option value="Masters">Master&apos;s Degree</option>
            <option value="Bachelor Degree">Bachelor&apos;s Degree</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Diploma and Professional">
              Diploma and Professional
            </option>
            <option value="AL">Advanced Level (A/L)</option>
          </select>
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.highestEducation?.message as string}
          </p>
        </div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="yearsExperience">
            Years of Experience <span className="text-red-500">*</span>
          </Label>
          <Input
            id="yearsExperience"
            type="number"
            min={0}
            max={50}
            step={1}
            className={`${inputClass} ${errors.yearsExperience ? "border-red-500" : "border-gray-300"}`}
            {...register("yearsExperience", { valueAsNumber: true })}
          />
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.yearsExperience?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="tutorMediums">
            Tutor Mediums <span className="text-red-500">*</span>
          </Label>
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
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.tutorMediums?.message as string}
          </p>
        </div>
      </div>

      {/* ROW 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="grades">
            Grades <span className="text-red-500">*</span>
          </Label>
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
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.grades?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="subjects">
            Subjects <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="subjects"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={subjectOptions}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                hasError={!!errors.subjects}
                disabled={selectedGradeIds.length === 0}
              />
            )}
          />
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.subjects?.message as string}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcademicExperience;
