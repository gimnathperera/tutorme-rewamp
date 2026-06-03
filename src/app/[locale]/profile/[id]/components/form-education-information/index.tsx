"use client";

import NumberStepper from "@/components/shared/number-stepper";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import InputSelect from "@/components/shared/input-select";
import MultiSelect from "@/components/shared/MultiSelect";
import MultiFileUploadDropzone from "@/components/upload/multi-file-upload-dropzone";
import {
  CLASS_TYPE_OPTIONS,
  MEDIUM_OPTIONS,
  PREFERRED_LOCATION_OPTIONS,
  REGISTER_HIGHEST_EDUCATION_OPTIONS,
  TUTOR_TYPE_OPTIONS,
  isPhysicalClassType,
} from "@/configs/register-tutor";
import {
  EDUCATIONAL_DOCUMENT_OPTIONS,
  OPTIONAL_DOCUMENT_OPTIONS,
} from "@/configs/options";
import { Option } from "@/types/shared-types";
import { FC, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTranslateItems } from "@/hooks/useTranslateItems";
import { EducationInfoSchema } from "./schema";
import SubmitButton from "@/components/shared/submit-button";
import { isEmpty } from "lodash-es";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  dropdownOptionData: {
    gradesOptions: Option[];
    subjectsOptions: Option[];
  };
  form: ReturnType<any>;
  onFormSubmit: SubmitHandler<EducationInfoSchema>;
  isSubmitting: boolean;
};

const toOptions = (options: Array<{ value: string; text: string }>): Option[] =>
  options.map(({ text, value }) => ({ label: text, value }));

// Convert { label, value } → { text, value } for shared MultiSelect
const msOptions = (opts: Option[]) =>
  opts.map((o) => ({ value: o.value, text: o.label }));

const highestEducationOptions = toOptions(REGISTER_HIGHEST_EDUCATION_OPTIONS);
const fieldControlHeightClass = "h-11";

const selectClass = `${fieldControlHeightClass} w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring text-gray-900`;
const selectBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";
const selectColor = (value: string) =>
  value ? "text-gray-900" : "text-gray-500";

const DocumentRow = ({
  fieldName,
  index,
  options,
  control,
  errors,
  onRemove,
  removable,
  documentTypeLabel,
  uploadFileLabel,
  selectTypePlaceholder,
}: {
  fieldName: string;
  index: number;
  options: { value: string; text: string }[];
  control: any;
  errors: any;
  onRemove: () => void;
  removable: boolean;
  documentTypeLabel: string;
  uploadFileLabel: string;
  selectTypePlaceholder: string;
}) => {
  const rowErrors = errors[index] ?? {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-start p-3 rounded-lg border border-gray-200 bg-gray-50">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium mb-1">
          {documentTypeLabel}
        </span>
        <Controller
          name={`${fieldName}.${index}.type`}
          control={control}
          render={({ field: f }) => (
            <select
              {...f}
              className={`${selectClass} ${selectBorder(!!rowErrors.type)} ${selectColor(f.value)}`}
            >
              <option value="" disabled hidden>
                {selectTypePlaceholder}
              </option>
              {options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="text-gray-900"
                >
                  {opt.text}
                </option>
              ))}
            </select>
          )}
        />
        {rowErrors.type && (
          <p className="text-xs text-red-500">{rowErrors.type.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
        <span className="text-xs text-gray-500 font-medium mb-1">
          {uploadFileLabel}
        </span>
        <Controller
          name={`${fieldName}.${index}.url`}
          control={control}
          render={({ field: f }) => (
            <MultiFileUploadDropzone
              initialUrls={f.value ? [f.value] : []}
              onUploaded={(urls) => f.onChange(urls[urls.length - 1] ?? "")}
            />
          )}
        />
        {rowErrors.url && (
          <p className="text-xs text-red-500">{rowErrors.url.message}</p>
        )}
      </div>

      <div className="flex items-start pt-7">
        <button
          type="button"
          onClick={onRemove}
          disabled={!removable}
          className="p-2 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Remove this document"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const FormEducationInfo: FC<Props> = ({
  dropdownOptionData: {
    gradesOptions: rawGrades,
    subjectsOptions: rawSubjects,
  },
  form,
  onFormSubmit,
  isSubmitting,
}) => {
  const t = useTranslations("profile");

  // Translate grade/subject names for display while keeping IDs as values
  const gradesOptions = useTranslateItems(
    rawGrades,
    (g) => [g.label],
    (g, [label]) => ({ ...g, label: label ?? g.label }),
  );
  const subjectsOptions = useTranslateItems(
    rawSubjects,
    (s) => [s.label],
    (s, [label]) => ({ ...s, label: label ?? s.label }),
  );
  const { isDirty, isValid } = form.formState;

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control: form.control,
    name: "certificatesAndQualifications",
  });

  const {
    fields: optFields,
    append: appendOpt,
    remove: removeOpt,
  } = useFieldArray({
    control: form.control,
    name: "optionalCertificates",
  });

  const certErrors =
    (form.formState.errors.certificatesAndQualifications as any) ?? [];

  const [
    classType,
    preferredLocations,
    tutorTypes,
    highestEducation,
    yearsExperience,
    tutorMediums,
    selectedGrades,
    subjects,
    certificatesAndQualifications,
  ] = form.watch([
    "classType",
    "preferredLocations",
    "tutorTypes",
    "highestEducation",
    "yearsExperience",
    "tutorMediums",
    "grades",
    "subjects",
    "certificatesAndQualifications",
  ]);
  const isPreferredLocationsEnabled =
    Array.isArray(classType) && classType.some(isPhysicalClassType);

  useEffect(() => {
    if (isPreferredLocationsEnabled) return;

    form.setValue("preferredLocations", [], {
      shouldDirty: false,
      shouldValidate: true,
    });
    form.clearErrors("preferredLocations");
  }, [form, isPreferredLocationsEnabled]);

  const hasAllRequiredFields =
    Array.isArray(classType) &&
    classType.length > 0 &&
    (!isPreferredLocationsEnabled ||
      (Array.isArray(preferredLocations) && preferredLocations.length > 0)) &&
    Array.isArray(tutorTypes) &&
    tutorTypes.length > 0 &&
    typeof highestEducation === "string" &&
    highestEducation.trim().length > 0 &&
    yearsExperience !== "" &&
    yearsExperience !== null &&
    yearsExperience !== undefined &&
    Array.isArray(tutorMediums) &&
    tutorMediums.length > 0 &&
    Array.isArray(selectedGrades) &&
    selectedGrades.length > 0 &&
    Array.isArray(subjects) &&
    subjects.length > 0 &&
    Array.isArray(certificatesAndQualifications) &&
    certificatesAndQualifications.length > 0;
  const isButtonDisabled =
    !isDirty || isSubmitting || !hasAllRequiredFields || !isValid;

  return (
    <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 2xl:col-span-2">
      <h3 className="mb-4 text-lg font-semibold sm:text-xl">
        {t("qualificationsTitle")}
      </h3>
      <p className="mb-5 text-sm text-gray-500">{t("qualificationsDesc")}</p>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6">
              {/* Class Type */}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  {t("fieldClassType")} <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="classType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      options={CLASS_TYPE_OPTIONS}
                      defaultSelected={field.value ?? []}
                      onChange={field.onChange}
                      hasError={!!fieldState.error}
                      placeholder={t("fieldClassType")}
                    />
                  )}
                />
                <span className="min-h-4 text-xs text-gray-500"></span>
              </div>

              {/* Preferred Locations */}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  {t("fieldPreferredLocations")}
                  {isPreferredLocationsEnabled && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>
                <Controller
                  name="preferredLocations"
                  control={form.control}
                  render={({ field }) => (
                    <MultiSelect
                      options={PREFERRED_LOCATION_OPTIONS}
                      defaultSelected={field.value ?? []}
                      onChange={field.onChange}
                      disabled={!isPreferredLocationsEnabled}
                      hasError={
                        isPreferredLocationsEnabled &&
                        !!form.formState.errors.preferredLocations
                      }
                      searchable
                    />
                  )}
                />
                <span
                  className={`min-h-4 text-xs ${
                    isPreferredLocationsEnabled &&
                    form.formState.errors.preferredLocations
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {isPreferredLocationsEnabled
                    ? ((form.formState.errors.preferredLocations
                        ?.message as string) ?? "")
                    : t("locationsPhysicalOnly")}
                </span>
              </div>

              {/* Tutor Types */}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  {t("fieldTutorTypes")} <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="tutorTypes"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      options={TUTOR_TYPE_OPTIONS}
                      defaultSelected={field.value ?? []}
                      onChange={field.onChange}
                      hasError={!!fieldState.error}
                      placeholder={t("fieldTutorTypes")}
                    />
                  )}
                />
                <span className="min-h-4 text-xs text-gray-500"></span>
              </div>

              {/* Highest Education Level */}
              <InputSelect
                label={t("fieldHighestEducation")}
                name="highestEducation"
                options={highestEducationOptions}
                className={fieldControlHeightClass}
                reserveHelperSpace
              />

              {/* Years of Experience */}
              <NumberStepper
                name="yearsExperience"
                min={0}
                max={50}
                label={t("fieldYearsExperience")}
                required
                reserveHelperSpace
              />

              {/* Tutor Mediums */}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  {t("fieldTutorMediums")} <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="tutorMediums"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      options={MEDIUM_OPTIONS}
                      defaultSelected={field.value ?? []}
                      onChange={field.onChange}
                      hasError={!!fieldState.error}
                      placeholder={t("fieldTutorMediums")}
                    />
                  )}
                />
                <span className="min-h-4 text-xs text-gray-500"></span>
              </div>

              {/* Grades */}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  {t("fieldGrades")} <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="grades"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      options={msOptions(gradesOptions)}
                      defaultSelected={field.value ?? []}
                      onChange={field.onChange}
                      hasError={!!fieldState.error}
                      placeholder={t("fieldGrades")}
                    />
                  )}
                />
                <span className="min-h-4 text-xs text-gray-500"></span>
              </div>

              {/* Subjects */}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  {t("fieldSubjects")} <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="subjects"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      options={msOptions(subjectsOptions)}
                      defaultSelected={field.value ?? []}
                      onChange={field.onChange}
                      hasError={!!fieldState.error}
                      disabled={isEmpty(selectedGrades)}
                      placeholder={t("fieldSubjects")}
                    />
                  )}
                />
                <span className="min-h-4 text-xs text-gray-500"></span>
              </div>
            </div>

            {/* Certificates & Documents */}
            <div className="mt-5 rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("certificatesDocumentsTitle")}{" "}
                  <span className="text-red-500">*</span>
                </h3>
              </div>

              <div className="p-5 space-y-5">
                {/* Educational Details — mandatory */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    {t("educationalDetailsLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <div className="space-y-3">
                    {eduFields.map((field, index) => (
                      <DocumentRow
                        key={field.id}
                        fieldName="certificatesAndQualifications"
                        index={index}
                        options={EDUCATIONAL_DOCUMENT_OPTIONS}
                        control={form.control}
                        errors={certErrors}
                        onRemove={() => removeEdu(index)}
                        removable={eduFields.length > 1}
                        documentTypeLabel={t("documentTypeLabel")}
                        uploadFileLabel={t("uploadFileLabel")}
                        selectTypePlaceholder={t("selectTypePlaceholder")}
                      />
                    ))}
                  </div>

                  {typeof form.formState.errors.certificatesAndQualifications
                    ?.message === "string" && (
                    <p className="text-xs text-red-500 mt-1">
                      {
                        form.formState.errors.certificatesAndQualifications
                          .message
                      }
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 flex items-center gap-1.5"
                    onClick={() => appendEdu({ type: "", url: "" })}
                  >
                    <Plus size={15} />
                    {t("addDocument")}
                  </Button>
                </div>

                <hr className="border-gray-200" />

                {/* Optional Details */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    {t("optionalDetailsLabel")}
                  </p>
                  <div className="space-y-3">
                    {optFields.map((field, index) => (
                      <DocumentRow
                        key={field.id}
                        fieldName="optionalCertificates"
                        index={index}
                        options={OPTIONAL_DOCUMENT_OPTIONS}
                        control={form.control}
                        errors={[]}
                        onRemove={() => removeOpt(index)}
                        removable={true}
                        documentTypeLabel={t("documentTypeLabel")}
                        uploadFileLabel={t("uploadFileLabel")}
                        selectTypePlaceholder={t("selectTypePlaceholder")}
                      />
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 flex items-center gap-1.5"
                    onClick={() => appendOpt({ type: "", url: "" })}
                  >
                    <Plus size={15} />
                    {t("addDocument")}
                  </Button>
                </div>
              </div>
            </div>

            <div className="col-span-6 sm:col-full">
              <SubmitButton
                className="peer mt-4 rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:mt-5 sm:px-5 sm:text-base"
                type="submit"
                loading={isSubmitting}
                title={t("updateQualifications")}
                disabled={isButtonDisabled}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FormEducationInfo;
