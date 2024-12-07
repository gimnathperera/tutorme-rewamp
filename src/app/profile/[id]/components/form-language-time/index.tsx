import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  initialFormValues,
  LanguageOptionsSchema,
  languageOptionsSchema,
} from "./schema";
import { FC } from "react";
import InputSelect from "@/components/shared/input-select";

const languageOptions = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "Sinhala", label: "Sinhala" },
];

const timeZoneOptions = [
  { value: "UTC-5", label: "Eastern Time (US & Canada)" },
  { value: "UTC+1", label: "Central European Time" },
  { value: "UTC+9", label: "Japan Standard Time" },
  { value: "UTC+5:30", label: "Sri Lanka Standard Time" },
];

const FormLanguageTime: FC = () => {
  const passwordInfoForm = useForm({
    resolver: zodResolver(languageOptionsSchema),
    defaultValues: initialFormValues as LanguageOptionsSchema,
    mode: "onChange",
  });

  const onSubmit = (data: LanguageOptionsSchema) => {
    console.log("Form Submitted", data);
  };

  return (
    <div className="p-4 mb-4 bg-white  rounded-3xl 2xl:col-span-2  sm:p-6">
      <h3 className="mb-4 text-xl font-semibold ">Language & Time Settings </h3>
      <FormProvider {...passwordInfoForm}>
        <form onSubmit={passwordInfoForm.handleSubmit(onSubmit)}>
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
              <button
                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5 text-center"
                type="submit"
              >
                Save all
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FormLanguageTime;
