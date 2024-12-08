import { FormProvider } from "react-hook-form";

import InputSelect from "@/components/shared/input-select";
import { Option } from "@/types/shared-types";
import { FC } from "react";
import { LanguageOptionsSchema } from "./schema";
import SubmitButton from "@/components/shared/submit-button";
import { isEmpty } from "lodash-es";

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
    <div className="p-4 mb-4 bg-white  rounded-3xl 2xl:col-span-2  sm:p-6">
      <h3 className="mb-4 text-xl font-semibold ">Language & Time Settings </h3>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
              <InputSelect
                label="Select language"
                name="language"
                options={languageOptions}
              />
              <InputSelect
                label="Time Zone"
                name="timeZone"
                options={timeZoneOptions}
              />
            </div>
            <div className="col-span-6 sm:col-full">
              <SubmitButton
                className="peer font-medium rounded-lg text-sm px-5 py-2.5 mt-5 text-center bg-primary-700 text-white hover:bg-primary-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                type="submit"
                loading={isSubmitting}
                title="Save all"
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
