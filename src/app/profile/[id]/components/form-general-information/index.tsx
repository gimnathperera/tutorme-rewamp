import InputText from "@/components/shared/input-text";
import { FormProvider } from "react-hook-form";
import InputMultiSelect from "@/components/shared/input-multi-select";
import RadioGroup from "@/components/shared/input-radio";
import InputSelect from "@/components/shared/input-select";
import { Option } from "@/types/shared-types";
import { FC } from "react";
import { GeneralInfoSchema } from "./schema";

type Props = {
  dropdownOptionData: {
    gradesOptions: Option[];
    subjectsOptions: Option[];
    durationOptions: Option[];
    frequencyOptions: Option[];
    tutorTypesOptions: Option[];
    genderOptions: Option[];
  };
  form: ReturnType<any>;
};

const FormGeneralInfo: FC<Props> = ({
  dropdownOptionData: {
    gradesOptions,
    subjectsOptions,
    durationOptions,
    frequencyOptions,
    tutorTypesOptions,
    genderOptions,
  },
  form,
}) => {
  const onSubmit = (data: GeneralInfoSchema) => {
    console.log("Form Submitted", data);
  };

  return (
    <div className="p-4 mb-4 bg-white  rounded-3xl 2xl:col-span-2  sm:p-6">
      <h3 className="mb-4 text-xl font-semibold ">General information</h3>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols- gap-6">
              <InputText
                label="Full Name"
                placeholder="First Name"
                name="name"
                type="text"
              />

              <InputText
                label="Email"
                placeholder="Email"
                name="email"
                type="text"
              />
              <InputText
                label="Phone Number"
                placeholder="Phone Number"
                name="phoneNumber"
                type="tel"
              />
              <InputText
                label="Country"
                placeholder="Country"
                name="country"
                type="text"
              />
              <InputText
                label="City"
                placeholder="City"
                name="city"
                type="text"
              />
              <InputText
                label="State / Province"
                placeholder="State / Province"
                name="state"
                type="text"
              />
              <InputText
                label="Region"
                placeholder="Region"
                name="region"
                type="text"
              />
              <InputText
                label="ZIP / Postal code"
                placeholder="ZIP / Postal code"
                name="zip"
                type="text"
              />
              <InputText
                label="Address"
                placeholder="Address"
                name="address"
                type="text"
              />
              <InputText
                label="Birthday"
                placeholder="Birthday"
                name="birthday"
                type="text"
              />
              <InputSelect
                label="Grade/Level"
                name="grade"
                options={gradesOptions}
              />
              <InputMultiSelect
                label="Subjects"
                name="subjects"
                options={subjectsOptions}
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

export default FormGeneralInfo;
