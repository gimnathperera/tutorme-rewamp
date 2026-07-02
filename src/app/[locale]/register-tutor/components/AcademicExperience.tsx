"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/shared/MultiSelect";
import NumberStepper from "@/components/shared/number-stepper";

import {
  isPhysicalClassType,
  PREFERRED_LOCATION_OPTIONS,
} from "@/configs/register-tutor";
import { useTranslations } from "next-intl";

import {
  useFetchGradesQuery,
  useFetchSubjectsForGradesMutation,
} from "@/store/api/splits/grades";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslateItems } from "@/hooks/useTranslateItems";

/** Shared style tokens – keep in sync with other register-tutor components */
const fieldWrapper = "flex flex-col gap-1.5";
type MultiSelectOnChange = NonNullable<
  Parameters<typeof MultiSelect>[0]["onChange"]
>;

type OptionItem = { value: string; text: string };

const AcademicExperience = () => {
  const t = useTranslations("registerTutor");
  const searchPh = t("searchPlaceholder");
  const noResultsText = (query: string) => t("noResultsFor", { query });
  const {
    control,
    watch,
    setValue,
    getValues,
    setError,
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
  // Each selectable grade already carries its subjects (the grade dropdown is
  // built from this same data), so derive everything synchronously — no extra
  // fetch, no races, and every selected grade is guaranteed to be present.
  const gradeById = useMemo(() => {
    const map = new Map<string, any>();
    gradeData?.results?.forEach((g: any) => map.set(g.id, g));
    return map;
  }, [gradeData]);

  // Subject IDs available for each selected grade. Derived synchronously from
  // the nested grade data (reliable, no race) and used ONLY to validate that
  // every selected grade has at least one selected subject — kept independent
  // of how the dropdown options are loaded below.
  const subjectsByGrade = useMemo<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    selectedGradeIds.forEach((gradeId) => {
      const grade = gradeById.get(gradeId);
      map[gradeId] = (grade?.subjects ?? []).map((s: any) => s.id as string);
    });
    return map;
  }, [selectedGradeIds, gradeById]);

  // Latest validation map, readable inside the async loader without adding it
  // as a dependency.
  const subjectsByGradeRef = useRef(subjectsByGrade);
  subjectsByGradeRef.current = subjectsByGrade;

  // Dropdown subject options, loaded from the API for the selected grades
  // (original behaviour — kept alongside the per-grade validation above).
  const [fetchSubjectsForGrades] = useFetchSubjectsForGradesMutation();
  const [subjectOptions, setSubjectOptions] = useState<OptionItem[]>([]);
  const classTypeOptions = useMemo(
    () => [
      { value: "Online - Individual", text: t("optClassTypeOnlineIndividual") },
      { value: "Online - Group", text: t("optClassTypeOnlineGroup") },
      {
        value: "Physical - Individual",
        text: t("optClassTypePhysicalIndividual"),
      },
      { value: "Physical - Group", text: t("optClassTypePhysicalGroup") },
    ],
    [t],
  );
  const tutorTypeOptions = useMemo(
    () => [
      {
        value: "International School Teacher",
        text: t("optTutorTypeInternational"),
      },
      {
        value: "Government School Teacher",
        text: t("optTutorTypeGovernment"),
      },
      { value: "University Student", text: t("optTutorTypeUniversity") },
      { value: "Diploma Holder", text: t("optTutorTypeDiploma") },
      { value: "Part-time Tutor", text: t("optTutorTypePartTime") },
      { value: "Full-time Tutor", text: t("optTutorTypeFullTime") },
    ],
    [t],
  );
  const highestEducationOptions = useMemo(
    () => [
      { value: "PhD", text: t("optHighestEducationPhd") },
      { value: "Masters", text: t("optHighestEducationMasters") },
      {
        value: "Bachelor Degree",
        text: t("optHighestEducationBachelor"),
      },
      {
        value: "Undergraduate",
        text: t("optHighestEducationUndergraduate"),
      },
      {
        value: "Diploma and Professional",
        text: t("optHighestEducationDiplomaProfessional"),
      },
      { value: "AL", text: t("optHighestEducationAL") },
    ],
    [t],
  );
  const mediumOptions = useMemo(
    () => [
      { value: "Sinhala", text: t("optMediumSinhala") },
      { value: "English", text: t("optMediumEnglish") },
      { value: "Tamil", text: t("optMediumTamil") },
    ],
    [t],
  );

  // Raw grade options - values are IDs, text is translated for display
  const rawGradeOptions = useMemo<OptionItem[]>(
    () =>
      gradeData?.results?.map((g: any) => ({ value: g.id, text: g.title })) ??
      [],
    [gradeData],
  );
  const gradeOptions = useTranslateItems(
    rawGradeOptions,
    (g) => [g.text],
    (g, [text]) => ({ ...g, text: text ?? g.text }),
  );

  // Subject options translated for display (values remain IDs)
  const translatedSubjectOptions = useTranslateItems(
    subjectOptions,
    (s) => [s.text],
    (s, [text]) => ({ ...s, text: text ?? s.text }),
  );
  const preferredLocationOptions = useTranslateItems(
    isPreferredLocationsEnabled ? PREFERRED_LOCATION_OPTIONS : [],
    (location) => [location.text],
    (location, [text]) => ({ ...location, text: text ?? location.text }),
  );

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

  // Every selected grade that offers subjects must have at least one selected
  // subject. Driven imperatively (not via a watch effect) so it reacts the
  // instant the user picks/removes a subject — setting/clearing the error
  // re-renders through the formState subscription, which is reliable.
  const validateSubjectCoverage = useCallback(
    (subjectIds: string[], gradeMap: Record<string, string[]>) => {
      if (
        selectedGradeIds.length === 0 ||
        Object.keys(gradeMap).length === 0 ||
        subjectIds.length === 0
      ) {
        return;
      }

      const selectedSet = new Set(subjectIds);
      const hasGradeWithoutSubject = selectedGradeIds.some((gradeId) => {
        const gradeSubjects = gradeMap[gradeId] ?? [];
        return (
          gradeSubjects.length > 0 &&
          !gradeSubjects.some((id) => selectedSet.has(id))
        );
      });

      if (hasGradeWithoutSubject) {
        setError("subjects", {
          type: "manual",
          message: t("subjectPerGradeRequired"),
        });
      } else {
        clearErrors("subjects");
      }
    },
    [selectedGradeIds, setError, clearErrors, t],
  );

  // Subjects-specific change handler: update the value, then re-validate
  // per-grade coverage immediately.
  const handleSubjectsChange = (
    onChange: MultiSelectOnChange,
    selected: string[],
  ) => {
    onChange(selected);
    if (selected.length === 0) {
      // Empty selection: required while a grade is selected, otherwise clear.
      if (selectedGradeIds.length > 0) {
        setError("subjects", {
          type: "manual",
          message: t("subjectsRequired"),
        });
      } else {
        clearErrors("subjects");
      }
      return;
    }
    validateSubjectCoverage(selected, subjectsByGrade);
  };

  useEffect(() => {
    if (isPreferredLocationsEnabled) return;

    setValue("preferredLocations", [], { shouldValidate: true });
    clearErrors("preferredLocations");
  }, [clearErrors, isPreferredLocationsEnabled, setValue]);

  // Load the dropdown subject options for the selected grades from the API
  // (original behaviour), prune any selected subjects that no longer belong to
  // the current grades, then re-validate per-grade coverage against the nested
  // map. Covers grade changes and tab remounts; live picks go through
  // handleSubjectsChange.
  useEffect(() => {
    if (selectedGradeIds.length === 0) {
      setSubjectOptions([]);
      setValue("subjects", []);
      clearErrors("subjects");
      return;
    }

    let cancelled = false;

    const loadSubjects = async () => {
      try {
        const res = await fetchSubjectsForGrades({
          gradeIds: selectedGradeIds,
        }).unwrap();
        if (cancelled) return;

        const newOptions = res.subjects.map((s: any) => ({
          value: s.id as string,
          text: s.title as string,
        }));
        setSubjectOptions(newOptions);

        const validIds = new Set(newOptions.map((o) => o.value));
        const currentSubjects: string[] = getValues("subjects") ?? [];
        const filtered = currentSubjects.filter((id) => validIds.has(id));
        if (filtered.length !== currentSubjects.length) {
          setValue("subjects", filtered);
        }
        if (filtered.length === 0) {
          // A grade is selected but no subject is chosen yet — surface the
          // "subjects required" error immediately (the field is now mandatory).
          setError("subjects", {
            type: "manual",
            message: t("subjectsRequired"),
          });
        } else {
          validateSubjectCoverage(filtered, subjectsByGradeRef.current);
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load subjects", error);
        setSubjectOptions([]);
      }
    };

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, [
    selectedGradeIds,
    fetchSubjectsForGrades,
    getValues,
    setValue,
    setError,
    clearErrors,
    t,
    validateSubjectCoverage,
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
                options={classTypeOptions}
                defaultSelected={field.value || []}
                onChange={(selected) =>
                  handleMultiSelectChange("classType", field.onChange, selected)
                }
                hasError={!!errors.classType}
                placeholder={t("classTypePlaceholder")}
                clearSearchLabel={t("clearSearch")}
                noResultsText={noResultsText}
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
                options={preferredLocationOptions}
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
                searchPlaceholder={searchPh}
                clearSearchLabel={t("clearSearch")}
                noResultsText={noResultsText}
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
                options={tutorTypeOptions}
                defaultSelected={field.value || []}
                onChange={(selected) =>
                  handleMultiSelectChange("tutorType", field.onChange, selected)
                }
                hasError={!!errors.tutorType}
                placeholder={t("tutorTypesPlaceholder")}
                clearSearchLabel={t("clearSearch")}
                noResultsText={noResultsText}
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
                options={highestEducationOptions}
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
                options={mediumOptions}
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
                clearSearchLabel={t("clearSearch")}
                noResultsText={noResultsText}
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
                options={gradeOptions}
                defaultSelected={field.value || []}
                onChange={(selected) =>
                  handleMultiSelectChange("grades", field.onChange, selected)
                }
                hasError={!!errors.grades}
                placeholder={t("gradesPlaceholder")}
                clearSearchLabel={t("clearSearch")}
                noResultsText={noResultsText}
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
                options={translatedSubjectOptions}
                defaultSelected={field.value || []}
                onChange={(selected) =>
                  handleSubjectsChange(field.onChange, selected)
                }
                hasError={!!errors.subjects}
                disabled={selectedGradeIds.length === 0}
                placeholder={t("subjectsPlaceholder")}
                clearSearchLabel={t("clearSearch")}
                noResultsText={noResultsText}
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
