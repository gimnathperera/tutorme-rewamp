import { Option } from "@/types/shared-types";

export type LogicReturnType = {
  derivedData: {
    dropdownOptionData: {
      gradesOptions: Option[];
      subjectsOptions: Option[];
      durationOptions: Option[];
      frequencyOptions: Option[];
      tutorTypesOptions: Option[];
      genderOptions: Option[];
    };
    loading: {
      isProfileDataLoading: boolean;
      isGradeLoading: boolean;
    };
  };
  forms: {
    generalInfoForm: ReturnType<any>;
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
