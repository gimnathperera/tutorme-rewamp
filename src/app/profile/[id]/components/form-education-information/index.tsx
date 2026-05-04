import InputText from "@/components/shared/input-text";
import { Controller, FormProvider, SubmitHandler } from "react-hook-form";
import InputMultiSelect from "@/components/shared/input-multi-select";
import InputSelect from "@/components/shared/input-select";
import MultiFileUploadDropzone from "@/components/upload/multi-file-upload-dropzone";
import { Textarea } from "@/components/ui/textarea";
import {
  MEDIUM_OPTIONS,
  PREFERRED_LOCATION_OPTIONS,
  TUTOR_TYPE_OPTIONS,
} from "@/configs/register-tutor";
import { Option } from "@/types/shared-types";
import { FC } from "react";
import { EducationInfoSchema } from "./schema";
import SubmitButton from "@/components/shared/submit-button";
import { isEmpty } from "lodash-es";
import { collapseTextSpaces } from "@/utils/form-normalizers";

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

const preferredLocationsOptions = toOptions(PREFERRED_LOCATION_OPTIONS);
const tutorTypeOptions = toOptions(TUTOR_TYPE_OPTIONS);
const tutorMediumOptions = toOptions(MEDIUM_OPTIONS);
const highestEducationOptions: Option[] = [
  { label: "PhD", value: "PhD" },
  { label: "Master's Degree", value: "Masters" },
  { label: "Bachelor's Degree", value: "Bachelor Degree" },
  { label: "Undergraduate", value: "Undergraduate" },
  {
    label: "Diploma and Professional",
    value: "Diploma and Professional",
  },
  { label: "Advanced Level (A/L)", value: "AL" },
];
const CHAR_LIMIT = 500;

const FormEducationInfo: FC<Props> = ({
  dropdownOptionData: { gradesOptions, subjectsOptions },
  form,
  onFormSubmit,
  isSubmitting,
}) => {
  const { isDirty, isValid } = form.formState;
  const [
    preferredLocations,
    tutorTypes,
    highestEducation,
    yearsExperience,
    tutorMediums,
    selectedGrades,
    subjects,
    academicDetails,
    certificatesAndQualifications,
  ] = form.watch([
    "preferredLocations",
    "tutorTypes",
    "highestEducation",
    "yearsExperience",
    "tutorMediums",
    "grades",
    "subjects",
    "academicDetails",
    "certificatesAndQualifications",
  ]);
  const hasAllRequiredFields =
    Array.isArray(preferredLocations) &&
    preferredLocations.length > 0 &&
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
    typeof academicDetails === "string" &&
    academicDetails.trim().length > 0 &&
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
                label="Preferred Locations *"
                name="preferredLocations"
                options={preferredLocationsOptions}
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

            <div className="mt-5 grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
              <Controller
                name="academicDetails"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="academicDetails"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Summary of Teaching Experience & Academic Achievements
                      <span className="text-red-500"> *</span>
                    </label>
                    <Textarea
                      id="academicDetails"
                      {...field}
                      onBlur={(event) => {
                        field.onBlur();
                        field.onChange(collapseTextSpaces(event.target.value));
                      }}
                      rows={4}
                      maxLength={CHAR_LIMIT}
                      placeholder="Achievements & subjects taught, such as number of students, years, and results"
                      className={`resize-y bg-white text-sm ${
                        fieldState.error ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <div className="flex min-h-[1.25rem] items-center justify-between gap-3">
                      <span className="text-xs text-red-500">
                        {fieldState.error?.message}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(field.value ?? "").length} / {CHAR_LIMIT}
                      </span>
                    </div>
                  </div>
                )}
              />

              <Controller
                name="certificatesAndQualifications"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Certificates <span className="text-red-500">*</span>
                    </label>
                    <MultiFileUploadDropzone
                      initialUrls={field.value}
                      onUploaded={(urls) => field.onChange(urls ?? [])}
                    />
                    {fieldState.error?.message && (
                      <span className="text-xs text-red-500">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />
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
