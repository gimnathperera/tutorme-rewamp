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
    <div className="p-4 mb-4 bg-white  rounded-3xl 2xl:col-span-2  sm:p-6">
      <h3 className="mb-4 text-xl font-semibold ">General information</h3>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols- gap-6">
              <InputText
                label="Full Name *"
                placeholder="First Name"
                name="name"
                type="text"
                onChange={(e) => {
                  const cleaned = stripLeadingSpaces(e.target.value);
                  form.setValue("name", cleaned, { shouldValidate: true });
                }}
                onBlur={(e) => {
                  form.setValue("name", collapseSpaces(e.target.value), {
                    shouldValidate: true,
                  });
                }}
              />

              <InputText
                label="Email *"
                placeholder="Email"
                name="email"
                type="text"
                disabled
              />
              <InputText
                label="Contact Number *"
                placeholder="Contact Number"
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
                  form.setValue("city", collapseSpaces(e.target.value), {
                    shouldValidate: true,
                  });
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
                  form.setValue("state", collapseSpaces(e.target.value), {
                    shouldValidate: true,
                  });
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
                  form.setValue("region", collapseSpaces(e.target.value), {
                    shouldValidate: true,
                  });
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
                  form.setValue("zip", collapseSpaces(e.target.value), {
                    shouldValidate: true,
                  });
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
                  form.setValue("address", collapseSpaces(e.target.value), {
                    shouldValidate: true,
                  });
                }}
              />
              <InputText
                label="Birthday *"
                name="birthday"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                onKeyDown={(e) => e.preventDefault()}
              />
              <InputMultiSelect
                label="Grade/Level"
                name="grades"
                options={gradesOptions}
              />
              <InputMultiSelect
                label="Subjects"
                name="subjects"
                options={subjectsOptions}
                isDisabled={isEmpty(selectedGrades)}
              />
              <InputSelect
                label="Duration"
                name="duration"
                options={durationOptions}
              />
              <InputSelect
                label="Frequency"
                name="frequency"
                options={frequencyOptions}
              />
              <InputSelect
                label="Gender"
                name="gender"
                options={genderOptions}
              />
              <RadioGroup
                label="Please select your preferred tutor type"
                name="tutorType"
                options={tutorTypesOptions}
              />
            </div>
            <div className="col-span-6 sm:col-full">
              <SubmitButton
                className="peer font-semibold rounded-lg text-base px-5 py-2.5 mt-5 text-center bg-primary-700 text-white hover:bg-primary-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                type="submit"
                loading={isSubmitting}
                title="Update General Information"
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
