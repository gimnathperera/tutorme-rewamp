import InputText from "@/components/shared/input-text";
import { FormProvider, SubmitHandler } from "react-hook-form";
import InputMultiSelect from "@/components/shared/input-multi-select";
import InputSelect from "@/components/shared/input-select";
import {
  MEDIUM_OPTIONS,
  PREFERRED_LOCATION_OPTIONS,
  TUTOR_TYPE_OPTIONS,
  TUTORING_LEVEL_OPTIONS,
} from "@/configs/register-tutor";
import { Option } from "@/types/shared-types";
import { FC } from "react";
import { GeneralInfoSchema } from "./schema";
import SubmitButton from "@/components/shared/submit-button";
import { isEmpty } from "lodash-es";

type Props = {
  dropdownOptionData: {
    gradesOptions: Option[];
    subjectsOptions: Option[];
    durationOptions: Option[];
    frequencyOptions: Option[];
    tutorTypesOptions: Option[];
    genderOptions: Option[];
    countryOptions: Option[];
  };
  form: ReturnType<any>;
  onFormSubmit: SubmitHandler<GeneralInfoSchema>;
  isSubmitting: boolean;
};

const toOptions = (
  options: Array<{ value: string; text: string }>,
): Option[] => options.map(({ text, value }) => ({ label: text, value }));

const tutoringLevelsOptions = toOptions(TUTORING_LEVEL_OPTIONS);
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

const FormEducationInfo: FC<Props> = ({
  dropdownOptionData: { gradesOptions, subjectsOptions },
  form,
  onFormSubmit,
  isSubmitting,
}) => {
  const { isDirty, errors } = form.formState;
  const [selectedGrades] = form.watch(["grades"]);
  const isButtonDisabled = !isDirty || isSubmitting || !isEmpty(errors);

  return (
    <div className="p-4 mb-4 bg-white rounded-3xl 2xl:col-span-2 sm:p-6">
      <h3 className="mb-4 text-xl font-semibold">Education information</h3>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputMultiSelect
                label="Tutoring Levels *"
                name="tutoringLevels"
                options={tutoringLevelsOptions}
              />

              <InputMultiSelect
                label="Preferred Locations *"
                name="preferredLocations"
                options={preferredLocationsOptions}
              />

              <InputMultiSelect
                label="Tutor Types *"
                name="tutorType"
                options={tutorTypeOptions}
              />

              <InputSelect
                label="Highest Education Level *"
                name="highestEducation"
                options={highestEducationOptions}
              />

              <InputText
                label="Years of Experience *"
                placeholder="Years of Experience"
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
            <div className="col-span-6 sm:col-full">
              <SubmitButton
                className="peer mt-5 rounded-lg bg-primary-700 px-5 py-2.5 text-center text-base font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                type="submit"
                loading={isSubmitting}
                title="Update Education Information"
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
