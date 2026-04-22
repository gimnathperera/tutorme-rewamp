/* eslint-disable unused-imports/no-unused-vars */

import InputText from "@/components/shared/input-text";
import { FormProvider } from "react-hook-form";
import InputMultiSelect from "@/components/shared/input-multi-select";
import RadioGroup from "@/components/shared/input-radio";
import InputSelect from "@/components/shared/input-select";
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
  onFormSubmit: (data: GeneralInfoSchema) => void;
  isSubmitting: boolean;
};

const stripLeadingSpaces = (value: string) => value.replace(/^ +/, "");
const collapseSpaces = (value: string) =>
  value.replace(/^ +/, "").replace(/ {2,}/g, " ").trimEnd();

const FormGeneralInfo: FC<Props> = ({
  dropdownOptionData: {
    gradesOptions,
    subjectsOptions,
    durationOptions,
    frequencyOptions,
    tutorTypesOptions,
    genderOptions,
    countryOptions,
  },
  form,
  onFormSubmit,
  isSubmitting,
}) => {
  const onSubmit = (data: GeneralInfoSchema) => {
    onFormSubmit(data);
  };

  const { isDirty, errors } = form.formState;
  const [selectedGrades] = form.watch(["grades"]);
  const isButtonDisabled = !isDirty || isSubmitting || !isEmpty(errors);

  return (
    <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 2xl:col-span-2">
      <h3 className="mb-4 text-lg font-semibold sm:text-xl">
        Candidate Snapshot
      </h3>
      <p className="mb-5 text-sm text-gray-500">
        Keep your core public profile details current so families can quickly
        assess your fit.
      </p>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-2 lg:gap-6">
              <InputText
                label="Tutor Name *"
                placeholder="Enter your full name"
                name="name"
                type="text"
                onChange={(e) => {
                  const cleaned = stripLeadingSpaces(e.target.value);
                  form.setValue("name", cleaned, { shouldValidate: true });
                }}
                onBlur={(e) => {
                  form.setValue("name", collapseSpaces(e.target.value), { shouldValidate: true });
                }}
              />

              <InputText
                label="Email *"
                placeholder="Email address"
                name="email"
                type="text"
                disabled
              />
              <InputText
                label="Contact Number *"
                placeholder="Enter your contact number"
                name="phoneNumber"
                type="tel"
              />
              <InputSelect
                label="Country *"
                placeholder="Country"
                name="country"
                options={countryOptions}
              />
              <InputText
                label="City *"
                placeholder="City"
                name="city"
                type="text"
                onChange={(e) => {
                  const cleaned = stripLeadingSpaces(e.target.value);
                  form.setValue("city", cleaned, { shouldValidate: true });
                }}
                onBlur={(e) => {
                  form.setValue("city", collapseSpaces(e.target.value), { shouldValidate: true });
                }}
              />
              <InputText
                label="State / Province *"
                placeholder="State / Province"
                name="state"
                type="text"
                onChange={(e) => {
                  const cleaned = stripLeadingSpaces(e.target.value);
                  form.setValue("state", cleaned, { shouldValidate: true });
                }}
                onBlur={(e) => {
                  form.setValue("state", collapseSpaces(e.target.value), { shouldValidate: true });
                }}
              />
              <InputText
                label="Region *"
                placeholder="Region"
                name="region"
                type="text"
                onChange={(e) => {
                  const cleaned = stripLeadingSpaces(e.target.value);
                  form.setValue("region", cleaned, { shouldValidate: true });
                }}
                onBlur={(e) => {
                  form.setValue("region", collapseSpaces(e.target.value), { shouldValidate: true });
                }}
              />
              <InputText
                label="ZIP / Postal code *"
                placeholder="ZIP / Postal code"
                name="zip"
                type="text"
                onChange={(e) => {
                  const cleaned = stripLeadingSpaces(e.target.value);
                  form.setValue("zip", cleaned, { shouldValidate: true });
                }}
                onBlur={(e) => {
                  form.setValue("zip", collapseSpaces(e.target.value), { shouldValidate: true });
                }}
              />
              <InputText
                label="Address *"
                placeholder="Address"
                name="address"
                type="text"
                onChange={(e) => {
                  const cleaned = stripLeadingSpaces(e.target.value);
                  form.setValue("address", cleaned, { shouldValidate: true });
                }}
                onBlur={(e) => {
                  form.setValue("address", collapseSpaces(e.target.value), { shouldValidate: true });
                }}
              />
              <InputText
                label="Date of Birth *"
                name="birthday"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                onKeyDown={(e) => e.preventDefault()}
              />
              <InputMultiSelect
                label="Levels / Grades Taught"
                name="grades"
                options={gradesOptions}
              />
              <InputMultiSelect
                label="Subjects Taught"
                name="subjects"
                options={subjectsOptions}
                isDisabled={isEmpty(selectedGrades)}
              />
              <InputSelect
                label="Lesson Duration"
                name="duration"
                options={durationOptions}
              />
              <InputSelect
                label="Lesson Frequency"
                name="frequency"
                options={frequencyOptions}
              />
              <InputSelect
                label="Gender"
                name="gender"
                options={genderOptions}
              />
              <RadioGroup
                label="Tutor Type"
                name="tutorType"
                options={tutorTypesOptions}
              />
            </div>
            <div className="col-span-6 sm:col-full">
              <SubmitButton
                className="peer mt-4 rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:mt-5 sm:px-5 sm:text-base"
                type="submit"
                loading={isSubmitting}
                title="Update Candidate Snapshot"
                disabled={isButtonDisabled}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FormGeneralInfo;
