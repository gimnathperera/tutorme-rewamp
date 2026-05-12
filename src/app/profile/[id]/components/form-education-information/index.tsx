import InputText from "@/components/shared/input-text";
import { Controller, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import InputMultiSelect from "@/components/shared/input-multi-select";
import InputSelect from "@/components/shared/input-select";
import MultiFileUploadDropzone from "@/components/upload/multi-file-upload-dropzone";
import {
  CLASS_TYPE_OPTIONS,
  MEDIUM_OPTIONS,
  PREFERRED_LOCATION_OPTIONS,
  REGISTER_HIGHEST_EDUCATION_OPTIONS,
  TUTOR_TYPE_OPTIONS,
  isPhysicalClassType,
} from "@/configs/register-tutor";
import { DOCUMENT_TYPE_OPTIONS } from "@/configs/options";
import { Option } from "@/types/shared-types";
import { FC, useEffect } from "react";
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

const classTypeOptions = toOptions(CLASS_TYPE_OPTIONS);
const preferredLocationsOptions = toOptions(PREFERRED_LOCATION_OPTIONS);
const tutorTypeOptions = toOptions(TUTOR_TYPE_OPTIONS);
const tutorMediumOptions = toOptions(MEDIUM_OPTIONS);
const highestEducationOptions = toOptions(REGISTER_HIGHEST_EDUCATION_OPTIONS);

const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring text-gray-900";
const selectBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";

const FormEducationInfo: FC<Props> = ({
  dropdownOptionData: { gradesOptions, subjectsOptions },
  form,
  onFormSubmit,
  isSubmitting,
}) => {
  const { isDirty, isValid } = form.formState;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certificatesAndQualifications",
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
      <h3 className="mb-4 text-lg font-semibold sm:text-xl">Qualifications</h3>
      <p className="mb-5 text-sm text-gray-500">
        Keep your tutor qualifications aligned with the same teaching and
        academic details used during tutor registration.
      </p>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6">
              <InputMultiSelect
                label="Class Type *"
                name="classType"
                options={classTypeOptions}
              />

              <InputMultiSelect
                label={`Preferred Locations${isPreferredLocationsEnabled ? " *" : ""}`}
                name="preferredLocations"
                options={preferredLocationsOptions}
                isDisabled={!isPreferredLocationsEnabled}
                isSearchable
                helperText={
                  isPreferredLocationsEnabled
                    ? undefined
                    : "Locations apply to physical classes only"
                }
              />

              <InputMultiSelect
                label="Tutor Types *"
                name="tutorTypes"
                options={tutorTypeOptions}
              />

              <InputSelect
                label="Highest Education Level *"
                name="highestEducation"
                options={highestEducationOptions}
              />

              <InputText
                label="Years of Experience *"
                placeholder="Enter total years of experience"
                name="yearsExperience"
                type="number"
                min={0}
                max={50}
                step={1}
              />

              <InputMultiSelect
                label="Tutor Mediums *"
                name="tutorMediums"
                options={tutorMediumOptions}
              />

              <InputMultiSelect
                label="Grades *"
                name="grades"
                options={gradesOptions}
              />

              <InputMultiSelect
                label="Subjects *"
                name="subjects"
                options={subjectsOptions}
                isDisabled={isEmpty(selectedGrades)}
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-3">
                Certificates <span className="text-red-500">*</span>
              </label>

              <div className="space-y-3">
                {fields.map((field, index) => {
                  const rowErrors = certErrors[index] ?? {};
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-start p-3 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      {/* Document Type */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-medium mb-1">
                          Document Type
                        </span>
                        <Controller
                          name={`certificatesAndQualifications.${index}.type`}
                          control={form.control}
                          render={({ field: f }) => (
                            <select
                              {...f}
                              className={`${selectClass} ${selectBorder(!!rowErrors.type)}`}
                            >
                              <option value="" disabled hidden>
                                Select type…
                              </option>
                              {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.text}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {rowErrors.type && (
                          <p className="text-xs text-red-500">
                            {rowErrors.type.message}
                          </p>
                        )}
                      </div>

                      {/* Upload Dropzone */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500 font-medium mb-1">
                          Upload File
                        </span>
                        <Controller
                          name={`certificatesAndQualifications.${index}.url`}
                          control={form.control}
                          render={({ field: f }) => (
                            <MultiFileUploadDropzone
                              initialUrls={f.value ? [f.value] : []}
                              onUploaded={(urls) =>
                                f.onChange(urls[urls.length - 1] ?? "")
                              }
                            />
                          )}
                        />
                        {rowErrors.url && (
                          <p className="text-xs text-red-500">
                            {rowErrors.url.message}
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <div className="flex items-start pt-7">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          className="p-2 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Remove this document"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {typeof form.formState.errors.certificatesAndQualifications?.message === "string" && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.certificatesAndQualifications.message}
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 flex items-center gap-1.5"
                onClick={() => append({ type: "", url: "" })}
              >
                <Plus size={15} />
                Add Document
              </Button>
            </div>
            <div className="col-span-6 sm:col-full">
              <SubmitButton
                className="peer mt-4 rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:mt-5 sm:px-5 sm:text-base"
                type="submit"
                loading={isSubmitting}
                title="Update Qualifications"
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
