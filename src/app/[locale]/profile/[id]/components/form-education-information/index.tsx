"use client";

import NumberStepper from "@/components/shared/number-stepper";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import InputSelect from "@/components/shared/input-select";
import MultiSelect from "@/components/shared/MultiSelect";
import MultiFileUploadDropzone from "@/components/upload/multi-file-upload-dropzone";
import {
  PREFERRED_LOCATION_OPTIONS,
  isPhysicalClassType,
} from "@/configs/register-tutor";
import { Option } from "@/types/shared-types";
import { FC, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useTranslateItems } from "@/hooks/useTranslateItems";
import { EducationInfoSchema, getSubjectCoverageState } from "./schema";
import SubmitButton from "@/components/shared/submit-button";
import { isEmpty } from "lodash-es";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  dropdownOptionData: {
    gradesOptions: Option[];
    subjectsOptions: Option[];
    subjectsByGrade: Record<string, string[]>;
  };
  form: ReturnType<any>;
  onFormSubmit: SubmitHandler<EducationInfoSchema>;
  isSubmitting: boolean;
};

// Convert { label, value } → { text, value } for shared MultiSelect
const msOptions = (opts: Option[]) =>
  opts.map((o) => ({ value: o.value, text: o.label }));

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
  uploadLabels,
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
  uploadLabels?: Record<string, string | ((fileName: string) => string)>;
}) => {
  const { trigger } = useFormContext();
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
              onChange={(e) => {
                f.onChange(e);
                trigger(`${fieldName}.${index}.type`);
              }}
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
              onUploaded={(urls) => {
                f.onChange(urls[urls.length - 1] ?? "");
                trigger(`${fieldName}.${index}.url`);
              }}
              labels={uploadLabels as any}
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
    subjectsByGrade,
  },
  form,
  onFormSubmit,
  isSubmitting,
}) => {
  const t = useTranslations("profile");
  const tR = useTranslations("registerTutor");

  const classTypeOptions = useMemo(
    () => [
      {
        value: "Online - Individual",
        text: tR("optClassTypeOnlineIndividual"),
      },
      { value: "Online - Group", text: tR("optClassTypeOnlineGroup") },
      {
        value: "Physical - Individual",
        text: tR("optClassTypePhysicalIndividual"),
      },
      { value: "Physical - Group", text: tR("optClassTypePhysicalGroup") },
    ],
    [tR],
  );

  const tutorTypeOptions = useMemo(
    () => [
      {
        value: "International School Teacher",
        text: tR("optTutorTypeInternational"),
      },
      {
        value: "Government School Teacher",
        text: tR("optTutorTypeGovernment"),
      },
      { value: "University Student", text: tR("optTutorTypeUniversity") },
      { value: "A/L Student", text: tR("optTutorTypeAL") },
      { value: "Diploma Holder", text: tR("optTutorTypeDiploma") },
      { value: "Part-time Tutor", text: tR("optTutorTypePartTime") },
      { value: "Full-time Tutor", text: tR("optTutorTypeFullTime") },
    ],
    [tR],
  );

  const highestEducationOptions = useMemo(
    () => [
      { value: "PhD", label: tR("optHighestEducationPhd") },
      { value: "Masters", label: tR("optHighestEducationMasters") },
      { value: "Bachelor Degree", label: tR("optHighestEducationBachelor") },
      { value: "Undergraduate", label: tR("optHighestEducationUndergraduate") },
      {
        value: "Diploma and Professional",
        label: tR("optHighestEducationDiplomaProfessional"),
      },
      { value: "AL", label: tR("optHighestEducationAL") },
    ],
    [tR],
  );

  const mediumOptions = useMemo(
    () => [
      { value: "Sinhala", text: tR("optMediumSinhala") },
      { value: "English", text: tR("optMediumEnglish") },
      { value: "Tamil", text: tR("optMediumTamil") },
    ],
    [tR],
  );

  const educationalDocumentOptions = useMemo(
    () => [
      {
        value: "Advanced Level Certificate",
        text: tR("optDocAdvancedLevelCertificate"),
      },
      { value: "Diploma Certificate", text: tR("optDocDiplomaCertificate") },
      { value: "Degree Certificate", text: tR("optDocDegreeCertificate") },
      {
        value: "Post Graduate Certificate",
        text: tR("optDocPostGraduateCertificate"),
      },
      {
        value: "CIMA, AAT, CA, etc... Certificates",
        text: tR("optDocCimaAatCaCertificates"),
      },
    ],
    [tR],
  );

  const optionalDocumentOptions = useMemo(
    () => [
      { value: "NIC", text: tR("optDocNIC") },
      { value: "Passport", text: tR("optDocPassport") },
      { value: "Driving License", text: tR("optDocDrivingLicense") },
      { value: "Police Clearance", text: tR("optDocPoliceClearance") },
      { value: "Other", text: tR("optDocOther") },
    ],
    [tR],
  );

  const uploadLabels = useMemo(
    () => ({
      certificateFallback: tR("certificateFallback"),
      zoomOut: tR("zoomOut"),
      zoomIn: tR("zoomIn"),
      closePreview: tR("closePreview"),
      previewUnavailable: tR("previewUnavailable"),
      fileTypeRejection: tR("fileTypeRejection"),
      uploadFailedFor: (fileName: string) =>
        tR("uploadFailedFor", { fileName }),
      uploading: tR("uploading"),
      dropFilesHere: tR("dropFilesHere"),
      uploadCertificatesCta: tR("uploadCertificatesCta"),
      acceptedFileTypes: tR("acceptedFileTypes"),
      previewFile: tR("previewFile"),
      removeFile: tR("removeFile"),
    }),
    [tR],
  );

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

  const gradesLabel = t("fieldGrades");
  const subjectsLabel = t("fieldSubjects");
  const { isDirty, isValid } = form.formState;

  // Run validation whenever a multi-select changes (including when the user
  // removes the last value) so the "<field> is required" message appears
  // immediately. MultiSelect never fires onBlur, so the form's "onTouched"
  // mode would otherwise never re-validate these fields on deselect.
  const handleMultiSelectChange =
    (fieldName: string, onChange: (selected: string[]) => void) =>
    (value: string[]) => {
      onChange(value);
      form.trigger(fieldName);
    };

  const fieldErrorMessage = (fieldName: string) =>
    (form.formState.errors[fieldName]?.message as string | undefined) ?? "";

  // Subjects-specific handler: update the value, then validate per-grade
  // coverage immediately (required when empty, per-grade when a selected grade
  // has no matching subject). Driven imperatively so it reacts on every pick
  // without relying on the schema (which can't express the per-grade rule).
  const handleSubjectsChange =
    (onChange: (selected: string[]) => void) => (value: string[]) => {
      onChange(value);
      const grades = (form.getValues("grades") as string[]) ?? [];
      const coverage = getSubjectCoverageState(grades, value, subjectsByGrade);
      if (coverage === "required") {
        form.setError("subjects", {
          type: "manual",
          message: t("subjectsRequired"),
        });
      } else if (coverage === "perGrade") {
        form.setError("subjects", {
          type: "manual",
          message: t("subjectPerGradeRequired"),
        });
      } else {
        form.clearErrors("subjects");
      }
    };

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
  const optErrors = (form.formState.errors.optionalCertificates as any) ?? [];

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
  const isButtonDisabled = !isDirty || isSubmitting || !hasAllRequiredFields;

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
                      options={classTypeOptions}
                      defaultSelected={field.value ?? []}
                      onChange={handleMultiSelectChange(
                        "classType",
                        field.onChange,
                      )}
                      hasError={!!fieldState.error}
                      placeholder={tR("classTypePlaceholder")}
                    />
                  )}
                />
                <span
                  className={`min-h-4 text-xs ${
                    fieldErrorMessage("classType")
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {fieldErrorMessage("classType")}
                </span>
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
                      onChange={handleMultiSelectChange(
                        "preferredLocations",
                        field.onChange,
                      )}
                      disabled={!isPreferredLocationsEnabled}
                      hasError={
                        isPreferredLocationsEnabled &&
                        !!form.formState.errors.preferredLocations
                      }
                      searchable
                      placeholder={tR("preferredLocationsPlaceholder")}
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
                      options={tutorTypeOptions}
                      defaultSelected={field.value ?? []}
                      onChange={handleMultiSelectChange(
                        "tutorTypes",
                        field.onChange,
                      )}
                      hasError={!!fieldState.error}
                      placeholder={tR("tutorTypesPlaceholder")}
                    />
                  )}
                />
                <span
                  className={`min-h-4 text-xs ${
                    fieldErrorMessage("tutorTypes")
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {fieldErrorMessage("tutorTypes")}
                </span>
              </div>

              {/* Highest Education Level */}
              <InputSelect
                label={t("fieldHighestEducation")}
                name="highestEducation"
                options={highestEducationOptions}
                placeholder={tR("highestEducationPlaceholder")}
                className={fieldControlHeightClass}
                required
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
                  {t("fieldTutorMediums")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="tutorMediums"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      options={mediumOptions}
                      defaultSelected={field.value ?? []}
                      onChange={handleMultiSelectChange(
                        "tutorMediums",
                        field.onChange,
                      )}
                      hasError={!!fieldState.error}
                      placeholder={tR("tutorMediumsPlaceholder")}
                    />
                  )}
                />
                <span
                  className={`min-h-4 text-xs ${
                    fieldErrorMessage("tutorMediums")
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {fieldErrorMessage("tutorMediums")}
                </span>
              </div>

              {/* Grades */}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  {gradesLabel} <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="grades"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      options={msOptions(gradesOptions)}
                      defaultSelected={field.value ?? []}
                      onChange={handleMultiSelectChange(
                        "grades",
                        field.onChange,
                      )}
                      hasError={!!fieldState.error}
                      placeholder={tR("gradesPlaceholder")}
                    />
                  )}
                />
                <span
                  className={`min-h-4 text-xs ${
                    fieldErrorMessage("grades")
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {fieldErrorMessage("grades")}
                </span>
              </div>

              {/* Subjects */}
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  {subjectsLabel} <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="subjects"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      options={msOptions(subjectsOptions)}
                      defaultSelected={field.value ?? []}
                      onChange={handleSubjectsChange(field.onChange)}
                      hasError={!!fieldState.error}
                      disabled={isEmpty(selectedGrades)}
                      placeholder={tR("subjectsPlaceholder")}
                    />
                  )}
                />
                <span
                  className={`min-h-4 text-xs ${
                    form.formState.errors.subjects
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {(form.formState.errors.subjects?.message as string) ?? ""}
                </span>
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
                {/* Educational Details - mandatory */}
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
                        options={educationalDocumentOptions}
                        control={form.control}
                        errors={certErrors}
                        onRemove={() => removeEdu(index)}
                        removable={eduFields.length > 1}
                        documentTypeLabel={t("documentTypeLabel")}
                        uploadFileLabel={t("uploadFileLabel")}
                        selectTypePlaceholder={t("selectTypePlaceholder")}
                        uploadLabels={uploadLabels}
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
                        options={optionalDocumentOptions}
                        control={form.control}
                        errors={optErrors}
                        onRemove={() => removeOpt(index)}
                        removable={true}
                        documentTypeLabel={t("documentTypeLabel")}
                        uploadFileLabel={t("uploadFileLabel")}
                        selectTypePlaceholder={t("selectTypePlaceholder")}
                        uploadLabels={uploadLabels}
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
