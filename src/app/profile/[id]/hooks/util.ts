/* eslint-disable unused-imports/no-unused-vars */

import { Option } from "@/types/shared-types";
import { GeneralInfoSchema } from "../components/form-general-information/schema";
import { LanguageOptionsSchema } from "../components/form-language-time/schema";

export type LogicReturnType = {
  derivedData: {
    dropdownOptionData: {
      gradesOptions: Option[];
      subjectsOptions: Option[];
      durationOptions: Option[];
      frequencyOptions: Option[];
      tutorTypesOptions: Option[];
      genderOptions: Option[];
      countryOptions: Option[];
      languageOptions: Option[];
      timeZoneOptions: Option[];
    };
    loading: {
      isProfileDataLoading: boolean;
      isGradeLoading: boolean;
      isGeneralFormSubmitting: boolean;
    };
  };
  forms: {
    generalInfoForm: ReturnType<any>;
    languageAndTimeForm: ReturnType<any>;
  };
  handlers: {
    onGeneralInfoFormSubmission: (data: GeneralInfoSchema) => void;
    onLanguageAndTimeFormSubmission: (data: LanguageOptionsSchema) => void;
  };
};

export const durationOptions = [
  { value: "30 minutes", label: "30 minutes" },
  { value: "1 hour", label: "1 hour" },
  { value: "2 hours", label: "2 hours" },
];

export const frequencyOptions = [
  { value: "Once a week", label: "Once a week" },
  { value: "Twice a week", label: "Twice a week" },
  { value: "Daily", label: "Daily" },
];

export const tutorTypesOptions = [
  { label: "Part Time Tutors", value: "part-time" },
  { label: "Full Time Tutors", value: "full-time" },
  {
    label: "Ex / Current Government School Tutors",
    value: "gov",
  },
];

export const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

export const countryOptions: Option[] = [
  { label: "Australia", value: "AU" },
  { label: "Brazil", value: "BR" },
  { label: "Canada", value: "CA" },
  { label: "China", value: "CN" },
  { label: "France", value: "FR" },
  { label: "Germany", value: "DE" },
  { label: "India", value: "IN" },
  { label: "Italy", value: "IT" },
  { label: "Japan", value: "JP" },
  { label: "Mexico", value: "MX" },
  { label: "Netherlands", value: "NL" },
  { label: "New Zealand", value: "NZ" },
  { label: "Norway", value: "NO" },
  { label: "Russia", value: "RU" },
  { label: "South Africa", value: "ZA" },
  { label: "South Korea", value: "KR" },
  { label: "Spain", value: "ES" },
  { label: "Sri Lanka", value: "SL" },
  { label: "Sweden", value: "SE" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
];

export const languageOptions = [
  { value: "en", label: "English" },
  { value: "sp", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "sn", label: "Sinhala" },
];

export const timeZoneOptions = [
  { value: "UTC-5", label: "Eastern Time (US & Canada)" },
  { value: "UTC+1", label: "Central European Time" },
  { value: "UTC+9", label: "Japan Standard Time" },
  { value: "UTC+5:30", label: "Sri Lanka Standard Time" },
];
