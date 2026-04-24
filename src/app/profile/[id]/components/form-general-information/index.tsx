/* eslint-disable unused-imports/no-unused-vars */

import InputText from "@/components/shared/input-text";
import { FormProvider } from "react-hook-form";
import InputSelect from "@/components/shared/input-select";
import { FC, KeyboardEvent, useEffect } from "react";
import { GeneralInfoSchema } from "./schema";
import SubmitButton from "@/components/shared/submit-button";
import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  RACE_OPTIONS,
} from "@/configs/register-tutor";
import {
  collapseTextSpaces,
  removeWhitespace,
  stripLeadingSpaces,
} from "@/utils/form-normalizers";

type Props = {
  form: ReturnType<any>;
  onFormSubmit: (data: GeneralInfoSchema) => void;
  isSubmitting: boolean;
};

const preventWhitespaceKey = (event: KeyboardEvent<HTMLInputElement>) => {
  if (/\s/.test(event.key)) {
    event.preventDefault();
  }
};

const toOptions = (options: Array<{ value: string; text: string }>) =>
  options.map(({ value, text }) => ({ value, label: text }));

const genderOptions = toOptions(GENDER_OPTIONS);
const nationalityOptions = toOptions(NATIONALITY_OPTIONS);
const raceOptions = toOptions(RACE_OPTIONS);

const calculateAge = (birthday?: string) => {
  if (!birthday) return "";

  const dob = new Date(birthday);

  if (Number.isNaN(dob.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age >= 0 ? age : "";
};

const FormGeneralInfo: FC<Props> = ({ form, onFormSubmit, isSubmitting }) => {
  const onSubmit = (data: GeneralInfoSchema) => {
    onFormSubmit(data);
  };

  const { isDirty, isValid } = form.formState;
  const birthday = form.watch("birthday");
  const [name, email, phoneNumber, age, gender, nationality, race] = form.watch([
    "name",
    "email",
    "phoneNumber",
    "age",
    "gender",
    "nationality",
    "race",
  ]);
  const hasBirthday =
    birthday instanceof Date
      ? !Number.isNaN(birthday.getTime())
      : typeof birthday === "string" && birthday.trim().length > 0;
  const hasAllRequiredFields =
    typeof name === "string" &&
    name.trim().length > 0 &&
    typeof email === "string" &&
    email.trim().length > 0 &&
    typeof phoneNumber === "string" &&
    phoneNumber.trim().length > 0 &&
    age !== "" &&
    age !== null &&
    age !== undefined &&
    typeof gender === "string" &&
    gender.trim().length > 0 &&
    typeof nationality === "string" &&
    nationality.trim().length > 0 &&
    typeof race === "string" &&
    race.trim().length > 0 &&
    hasBirthday;
  const isButtonDisabled =
    !isDirty || isSubmitting || !hasAllRequiredFields || !isValid;

  useEffect(() => {
    const nextAge = calculateAge(
      typeof birthday === "string" ? birthday : birthday?.toISOString?.(),
    );

    form.setValue("age", nextAge as unknown as number, {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [birthday, form]);

  return (
    <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 2xl:col-span-2">
      <h3 className="mb-4 text-lg font-semibold sm:text-xl">
        Personal Information
      </h3>
      <p className="mb-5 text-sm text-gray-500">
        Keep your tutor profile aligned with the same personal details used
        during tutor registration.
      </p>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-2 lg:gap-6">
              <InputText
                label="Full Name *"
                placeholder="e.g. Nimal Perera"
                name="name"
                type="text"
                onChange={(e) => {
                  const cleaned = stripLeadingSpaces(e.target.value);
                  if (cleaned !== e.target.value) {
                    e.target.value = cleaned;
                  }
                  form.setValue("name", cleaned, { shouldValidate: true });
                }}
                onBlur={(e) => {
                  form.setValue("name", collapseTextSpaces(e.target.value), {
                    shouldValidate: true,
                  });
                }}
              />

              <InputText
                label="Email"
                placeholder="Email address"
                name="email"
                type="text"
                disabled
                helperText="Email is read-only here. Contact support if you need to change it."
              />
              <InputText
                label="Contact Number *"
                placeholder="e.g. 0771234567"
                name="phoneNumber"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                onKeyDown={preventWhitespaceKey}
                onChange={(e) => {
                  const noSpaces = removeWhitespace(e.target.value);
                  if (noSpaces !== e.target.value) {
                    e.target.value = noSpaces;
                  }
                  form.setValue("phoneNumber", noSpaces, {
                    shouldValidate: true,
                  });
                }}
                onBlur={(e) => {
                  form.setValue("phoneNumber", removeWhitespace(e.target.value), {
                    shouldValidate: true,
                  });
                }}
              />
              <InputText
                label="Date of Birth *"
                name="birthday"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                onKeyDown={(e) => e.preventDefault()}
              />
              <InputText
                label="Age *"
                name="age"
                type="number"
                disabled
                placeholder="Auto-calculated"
                helperText="Age is read-only and updates automatically from your date of birth."
              />
              <InputSelect
                label="Gender *"
                name="gender"
                options={genderOptions}
              />
              <InputSelect
                label="Nationality *"
                name="nationality"
                options={nationalityOptions}
              />
              <InputSelect
                label="Race *"
                name="race"
                options={raceOptions}
              />
            </div>
            <div className="col-span-6 sm:col-full">
              <SubmitButton
                className="peer mt-4 rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:mt-5 sm:px-5 sm:text-base"
                type="submit"
                loading={isSubmitting}
                title="Update Personal Information"
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
