import InputText from "@/components/shared/input-text";
import InputDatePicker from "@/components/shared/input-date-picker";
import { FormProvider } from "react-hook-form";
import InputSelect from "@/components/shared/input-select";
import { FC, KeyboardEvent, useEffect, useMemo } from "react";
import { GeneralInfoSchema } from "./schema";
import { useTranslations } from "next-intl";
import SubmitButton from "@/components/shared/submit-button";
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

const fieldHeightClass = "h-11";

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

const formatDateInputValue = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const getAdultBirthDateLimit = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return formatDateInputValue(date);
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
  const t = useTranslations("profile");
  const tRegisterTutor = useTranslations("registerTutor");
  const genderOptions = useMemo(
    () => [
      { value: "Male", label: t("optGenderMale") },
      { value: "Female", label: t("optGenderFemale") },
      { value: "Others", label: t("optGenderOthers") },
    ],
    [t],
  );
  const nationalityOptions = useMemo(
    () => [
      {
        value: "Sri Lankan",
        label: tRegisterTutor("optNationalitySriLankan"),
      },
      { value: "Others", label: tRegisterTutor("optNationalityOthers") },
    ],
    [tRegisterTutor],
  );
  const raceOptions = useMemo(
    () => [
      { value: "Sinhalese", label: tRegisterTutor("optRaceSinhalese") },
      { value: "Tamil", label: tRegisterTutor("optRaceTamil") },
      { value: "Muslim", label: tRegisterTutor("optRaceMuslim") },
      { value: "Burgher", label: tRegisterTutor("optRaceBurgher") },
      { value: "Others", label: tRegisterTutor("optRaceOthers") },
    ],
    [tRegisterTutor],
  );
  const genderPlaceholder = tRegisterTutor("genderPlaceholder");
  const nationalityPlaceholder = tRegisterTutor("nationalityPlaceholder");
  const racePlaceholder = tRegisterTutor("racePlaceholder");
  const onSubmit = (data: GeneralInfoSchema) => {
    onFormSubmit(data);
  };

  const maxBirthday = getAdultBirthDateLimit();

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
        {t("personalInfoTitle")}
      </h3>
      <p className="mb-5 text-sm text-gray-500">{t("personalInfoDesc")}</p>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-2 lg:gap-6">
              <InputText
                label={t("fieldFullName")}
                placeholder={t("placeholderFullName")}
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
                label={t("fieldEmail")}
                placeholder={t("placeholderEmail")}
                name="email"
                type="text"
                disabled
                helperText={t("helperEmail")}
              />
              <InputText
                label={t("fieldContactNumber")}
                placeholder={t("placeholderContactNumber")}
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
              <InputDatePicker
                name="birthday"
                label={t("fieldDateOfBirth")}
                required
                maxDate={maxBirthday}
                reserveHelperSpace
              />
              <InputText
                label={t("fieldAge")}
                name="age"
                type="number"
                disabled
                placeholder={t("placeholderAge")}
                helperText={t("helperAge")}
              />
              <InputSelect
                label={t("fieldGender")}
                name="gender"
                options={genderOptions}
                placeholder={genderPlaceholder}
                className={fieldHeightClass}
              />
              <InputSelect
                label={t("fieldNationality")}
                name="nationality"
                options={nationalityOptions}
                placeholder={nationalityPlaceholder}
                className={fieldHeightClass}
              />
              <InputSelect
                label={t("fieldRace")}
                name="race"
                options={raceOptions}
                placeholder={racePlaceholder}
                className={fieldHeightClass}
              />
            </div>
            <div className="col-span-6 sm:col-full">
              <SubmitButton
                className="peer mt-4 rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:mt-5 sm:px-5 sm:text-base"
                type="submit"
                loading={isSubmitting}
                title={t("updatePersonalInfo")}
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
