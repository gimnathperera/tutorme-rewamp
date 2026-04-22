/* eslint-disable unused-imports/no-unused-vars */

import { FormProvider } from "react-hook-form";
import InputText from "@/components/shared/input-text";
import InputSelect from "@/components/shared/input-select";
import { Option } from "@/types/shared-types";
import { FC } from "react";
import { LanguageOptionsSchema } from "./schema";
import SubmitButton from "@/components/shared/submit-button";
import { isEmpty } from "lodash-es";
import AvailabilityScheduler from "./availability-scheduler";

type Props = {
  languageOptions: Option[];
  timeZoneOptions: Option[];
  form: ReturnType<any>;
  isSubmitting: boolean;
  onFormSubmit: (data: LanguageOptionsSchema) => void;
};

const FormLanguageTime: FC<Props> = ({
  languageOptions,
  timeZoneOptions,
  form,
  onFormSubmit,
  isSubmitting,
}) => {
  const { isDirty, errors } = form.formState;
  const isButtonDisabled = !isDirty || isSubmitting || !isEmpty(errors);

  const onSubmit = (data: LanguageOptionsSchema) => {
    onFormSubmit(data);
  };

  return (
    <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 2xl:col-span-2">
      <h3 className="mb-4 text-lg font-semibold sm:text-xl">
        Languages & Availability
      </h3>
      <p className="mb-5 text-sm text-gray-500">
        Set the communication language and working time zone used to coordinate
        lessons.
      </p>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-2 lg:gap-6">
              <InputSelect
                label="Primary Language"
                name="language"
                options={languageOptions}
              />
              <InputSelect
                label="Operating Time Zone"
                name="timeZone"
                options={timeZoneOptions}
              />
              <InputText
                label="Rate"
                name="rate"
                type="text"
                placeholder="e.g. $95/Hour"
              />
            </div>
            <div className="mt-4">
              <AvailabilityScheduler />
            </div>
            <div className="col-span-6 sm:col-full">
              <SubmitButton
                className="peer mt-4 rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:mt-5 sm:px-5 sm:text-base"
                type="submit"
                loading={isSubmitting}
                title="Update Languages & Availability"
                disabled={isButtonDisabled}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FormLanguageTime;
