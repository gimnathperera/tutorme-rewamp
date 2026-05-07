/* eslint-disable unused-imports/no-unused-vars */

import InputText from "@/components/shared/input-text";
import { FormProvider, Controller } from "react-hook-form";
import InputSelect from "@/components/shared/input-select";
import { FC, KeyboardEvent, useEffect, useRef } from "react";
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
import Icon from "@/components/shared/icon";

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

const normalizeBirthdayValue = (birthday: unknown) => {
  if (birthday instanceof Date) {
    return Number.isNaN(birthday.getTime())
      ? ""
      : birthday.toISOString().slice(0, 10);
  }

  return typeof birthday === "string" ? birthday.trim() : "";
};

const FormGeneralInfo: FC<Props> = ({ form, onFormSubmit, isSubmitting }) => {
  const onSubmit = (data: GeneralInfoSchema) => {
    onFormSubmit(data);
  };

  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const { defaultValues, isValid } = form.formState;
  const birthday = form.watch("birthday");
  const [name, email, phoneNumber, age, gender, nationality, race] = form.watch(
    ["name", "email", "phoneNumber", "age", "gender", "nationality", "race"],
  );
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
  const hasMeaningfulChanges =
    collapseTextSpaces(name ?? "") !==
      collapseTextSpaces(defaultValues?.name ?? "") ||
    removeWhitespace(email ?? "") !==
      removeWhitespace(defaultValues?.email ?? "") ||
    removeWhitespace(phoneNumber ?? "") !==
      removeWhitespace(defaultValues?.phoneNumber ?? "") ||
    normalizeBirthdayValue(birthday) !==
      normalizeBirthdayValue(defaultValues?.birthday) ||
    Number(age) !== Number(defaultValues?.age) ||
    gender !== defaultValues?.gender ||
    nationality !== defaultValues?.nationality ||
    race !== defaultValues?.race;
  const isButtonDisabled =
    !hasMeaningfulChanges || isSubmitting || !hasAllRequiredFields || !isValid;

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
                  form.setValue(
                    "phoneNumber",
                    removeWhitespace(e.target.value),
                    {
                      shouldValidate: true,
                    },
                  );
                }}
              />
              <Controller
                name="birthday"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="birthday"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div
                      className="relative cursor-pointer"
                      onClick={() => dateInputRef.current?.showPicker()}
                    >
                      <input
                        id="birthday"
                        type="date"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().slice(0, 10)
                            : (field.value ?? "")
                        }
                        ref={(el) => {
                          field.ref(el);
                          dateInputRef.current = el;
                        }}
                        onKeyDown={(e) => e.preventDefault()}
                        max={new Date().toISOString().split("T")[0]}
                        className={`h-10 w-full rounded-md border px-3 pr-10 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute ${
                          fieldState.error
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <Icon name="Calendar" size={16} />
                      </span>
                    </div>
                    {fieldState.error && (
                      <span className="text-xs text-red-500">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
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
              <InputSelect label="Race *" name="race" options={raceOptions} />
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
