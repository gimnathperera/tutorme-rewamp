import InputText from "@/components/shared/input-text";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  GeneralInfoSchema,
  generalInfoSchema,
  initialFormValues,
} from "./schema";
import { FC } from "react";
import InputSelect from "@/components/shared/input-select";
import RadioGroup from "@/components/shared/input-radio";
import InputMultiSelect from "@/components/shared/input-multi-select";

const gradesOptions = [
  { label: "Grade 5", value: "5" },
  { label: "Grade 6", value: "6" },
  { label: "Grade 7", value: "7" },
  { label: "Grade 8", value: "8" },
  { label: "Grade 9", value: "9" },
  { label: "Grade 10", value: "10" },
  { label: "Grade 11", value: "11" },
  { label: "Grade 12", value: "12" },
  { label: "Grade 13", value: "13" },
];

const subjectsOptions = [
  { value: "Math", label: "Math" },
  { value: "Science", label: "Science" },
  { value: "English", label: "English" },
  { value: "History", label: "History" },
];

const durationOptions = [
  { value: "30 minutes", label: "30 minutes" },
  { value: "1 hour", label: "1 hour" },
  { value: "2 hours", label: "2 hours" },
];

const frequencyOptions = [
  { value: "Once a week", label: "Once a week" },
  { value: "Twice a week", label: "Twice a week" },
  { value: "Daily", label: "Daily" },
];

const tutorTypes = [
  { label: "Part Time Tutors", value: "part-time" },
  { label: "Full Time Tutors", value: "full-time" },
  {
    label: "Ex / Current Government School Tutors",
    value: "govt",
  },
];

const FormGeneralInfo: FC = () => {
  const passwordInfoForm = useForm({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: initialFormValues as GeneralInfoSchema,
    mode: "onChange",
  });

  const onSubmit = (data: GeneralInfoSchema) => {
    console.log("Form Submitted", data);
  };

  return (
    <div className="p-4 mb-4 bg-white  rounded-3xl 2xl:col-span-2  sm:p-6">
      <h3 className="mb-4 text-xl font-semibold ">General information</h3>
      <FormProvider {...passwordInfoForm}>
        <form onSubmit={passwordInfoForm.handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols- gap-6">
              <InputText
                label="First Name"
                placeholder="First Name"
                name="firstName"
                type="text"
              />
              <InputText
                label="Last Name"
                placeholder="Last Name"
                name="lastName"
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
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "No Gender Preference", value: "None" },
                ]}
              />
              <RadioGroup
                label="Please select your preferred tutor type"
                name="tutorType"
                options={tutorTypes}
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
