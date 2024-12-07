import { Option } from "@/types/shared-types";
import { GeneralInfoSchema } from "../components/form-general-information/schema";

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
    };
    loading: {
      isProfileDataLoading: boolean;
      isGradeLoading: boolean;
      isGeneralFormSubmitting: boolean;
    };
  };
  forms: {
    generalInfoForm: ReturnType<any>;
  };
  handlers: {
    onGeneralInfoFormSubmission: (data: GeneralInfoSchema) => void;
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
    value: "govt",
  },
];

export const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "No Gender Preference", value: "None" },
];

export const countryOptions: Option[] = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "United Kingdom", value: "GB" },
  { label: "Australia", value: "AU" },
  { label: "Germany", value: "DE" },
  { label: "France", value: "FR" },
  { label: "India", value: "IN" },
  { label: "Brazil", value: "BR" },
  { label: "South Africa", value: "ZA" },
  { label: "Mexico", value: "MX" },
  { label: "Italy", value: "IT" },
  { label: "Spain", value: "ES" },
  { label: "Russia", value: "RU" },
  { label: "South Korea", value: "KR" },
  { label: "New Zealand", value: "NZ" },
  { label: "Netherlands", value: "NL" },
  { label: "Sweden", value: "SE" },
  { label: "Norway", value: "NO" },
  { label: "Japan", value: "JP" },
  { label: "China", value: "CN" },
  { label: "Sri Lanka", value: "SL" },
];
