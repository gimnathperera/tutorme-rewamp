"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/shared/MultiSelect";
import NumberStepper from "@/components/shared/number-stepper";

import {
  CLASS_TYPE_OPTIONS,
  isPhysicalClassType,
  PREFERRED_LOCATION_OPTIONS,
  REGISTER_HIGHEST_EDUCATION_OPTIONS,
  TUTOR_TYPE_OPTIONS,
  MEDIUM_OPTIONS,
} from "@/configs/register-tutor";
import { useTranslations } from "next-intl";

import {
  useFetchGradesQuery,
  useFetchSubjectsForGradesMutation,
} from "@/store/api/splits/grades";
import { useEffect, useMemo, useState } from "react";

/** Shared style tokens – keep in sync with other register-tutor components */
const fieldWrapper = "flex flex-col gap-1.5";
type MultiSelectOnChange = NonNullable<
  Parameters<typeof MultiSelect>[0]["onChange"]
>;

const AcademicExperience = () => {
  const t = useTranslations("registerTutor");
  const {
    control,
    watch,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const { data: gradeData } = useFetchGradesQuery({ page: 1, limit: 50 });
  const selectedGrades = watch("grades");
  const selectedClassTypes = watch("classType");

  const selectedGradeIds = useMemo<string[]>(() => {
    return Array.isArray(selectedGrades) ? selectedGrades : [];
  }, [selectedGrades]);
  const isPreferredLocationsEnabled = useMemo(() => {
    return (
      Array.isArray(selectedClassTypes) &&
      selectedClassTypes.some(isPhysicalClassType)
    );
  }, [selectedClassTypes]);
  const [fetchSubjectsForGrades] = useFetchSubjectsForGradesMutation();
  const [subjectOptions, setSubjectOptions] = useState<
    { value: string; text: string }[]
  >([]);

  const handleMultiSelectChange = (
    fieldName: string,
    onChange: MultiSelectOnChange,
    selected: string[],
  ) => {
    onChange(selected);

    if (selected.length > 0) {
      clearErrors(fieldName);
    }
  };

  useEffect(() => {
    if (isPreferredLocationsEnabled) return;

    setValue("preferredLocations", [], { shouldValidate: true });
    clearErrors("preferredLocations");
  }, [clearErrors, isPreferredLocationsEnabled, setValue]);

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
        if (filtered.length > 0) {
          clearErrors("subjects");
        }
      } catch (error) {
        console.error("Failed to load subjects", error);
        setSubjectOptions([]);
      }
    };

    loadSubjects();
  }, [
    clearErrors,
    selectedGradeIds,
    fetchSubjectsForGrades,
    setValue,
    getValues,
  ]);

  return (
    <div className="space-y-3">
      {/* ROW 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="classType">
            {t("classType")} <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="classType"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={CLASS_TYPE_OPTIONS}
                defaultSelected={field.value || []}
                onChange={(selected) =>
                  handleMultiSelectChange("classType", field.onChange, selected)
                }
                hasError={!!errors.classType}
                placeholder={t("classTypePlaceholder")}
              />
            )}
          />
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.classType?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="preferredLocations">
            {t("preferredLocations")}{" "}
            {isPreferredLocationsEnabled && (
              <span className="text-red-500">*</span>
            )}
          </Label>
          <Controller
            name="preferredLocations"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={PREFERRED_LOCATION_OPTIONS}
                defaultSelected={field.value || []}
                onChange={(selected) =>
                  handleMultiSelectChange(
                    "preferredLocations",
                    field.onChange,
                    selected,
                  )
                }
                disabled={!isPreferredLocationsEnabled}
                hasError={
                  isPreferredLocationsEnabled && !!errors.preferredLocations
                }
                searchable
                placeholder={t("preferredLocationsPlaceholder")}
              />
            )}
          />
          {isPreferredLocationsEnabled ? (
            <p className="text-xs leading-4 text-red-500 min-h-4">
              {errors.preferredLocations?.message as string}
            </p>
          ) : (
            <p className="text-xs leading-4 text-muted-foreground min-h-4">
              {t("locationsHint")}
            </p>
          )}
        </div>
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="tutorType">
            {t("tutorTypes")} <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="tutorType"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={TUTOR_TYPE_OPTIONS}
                defaultSelected={field.value || []}
                onChange={(selected) =>
                  handleMultiSelectChange("tutorType", field.onChange, selected)
                }
                hasError={!!errors.tutorType}
                placeholder={t("tutorTypesPlaceholder")}
              />
            )}
          />
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.tutorType?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="highestEducation">
            {t("highestEducation")} <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="highestEducation"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={REGISTER_HIGHEST_EDUCATION_OPTIONS}
                defaultSelected={field.value ? [field.value] : []}
                onChange={(selected) => {
                  field.onChange(selected[0] ?? "");
                  if (selected.length > 0) clearErrors("highestEducation");
                }}
                hasError={!!errors.highestEducation}
                singleSelect
                placeholder={t("highestEducationPlaceholder")}
              />
            )}
          />
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.highestEducation?.message as string}
          </p>
        </div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        <NumberStepper
          name="yearsExperience"
          min={0}
          max={50}
          label={t("yearsExperience")}
          required
        />

        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="tutorMediums">
            {t("tutorMediums")} <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="tutorMediums"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={MEDIUM_OPTIONS}
                defaultSelected={field.value || []}
                onChange={(selected) =>
                  handleMultiSelectChange(
                    "tutorMediums",
                    field.onChange,
                    selected,
                  )
                }
                hasError={!!errors.tutorMediums}
                placeholder={t("tutorMediumsPlaceholder")}
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
            {t("grades")} <span className="text-red-500">*</span>
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
                onChange={(selected) =>
                  handleMultiSelectChange("grades", field.onChange, selected)
                }
                hasError={!!errors.grades}
                placeholder={t("gradesPlaceholder")}
              />
            )}
          />
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.grades?.message as string}
          </p>
        </div>

        <div className={fieldWrapper}>
          <Label className="text-sm" htmlFor="subjects">
            {t("subjects")} <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="subjects"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={subjectOptions}
                defaultSelected={field.value || []}
                onChange={(selected) =>
                  handleMultiSelectChange("subjects", field.onChange, selected)
                }
                hasError={!!errors.subjects}
                disabled={selectedGradeIds.length === 0}
                placeholder={t("subjectsPlaceholder")}
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
