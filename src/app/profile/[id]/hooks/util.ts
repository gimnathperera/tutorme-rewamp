/* eslint-disable unused-imports/no-unused-vars */

import { Option } from "@/types/shared-types";
import { AuthUserData } from "@/types/auth-types";
import { ProfileResponse } from "@/types/response-types";
import { EducationInfoSchema } from "../components/form-education-information/schema";
import { GeneralInfoSchema } from "../components/form-general-information/schema";
import { LanguageOptionsSchema } from "../components/form-language-time/schema";
import { TeachingProfileSchema } from "../components/form-teaching-profile/schema";

export type LogicReturnType = {
  derivedData: {
    dropdownOptionData: {
      gradesOptions: Option[];
      educationSubjectsOptions: Option[];
      languageOptions: Option[];
      timeZoneOptions: Option[];
      rateOptions: Option[];
    };
    loading: {
      isProfileDataLoading: boolean;
      isGradeLoading: boolean;
      isGeneralFormSubmitting: boolean;
    };
    profileData: ProfileResponse | null;
    currentUser: AuthUserData | null;
    isAdminProfile: boolean;
  };
  forms: {
    generalInfoForm: ReturnType<any>;
    educationInfoForm: ReturnType<any>;
    languageAndTimeForm: ReturnType<any>;
    teachingProfileForm: ReturnType<any>;
  };
  handlers: {
    onGeneralInfoFormSubmission: (data: GeneralInfoSchema) => void;
    onEducationInfoFormSubmission: (data: EducationInfoSchema) => void;
    onLanguageAndTimeFormSubmission: (data: LanguageOptionsSchema) => void;
    onTeachingProfileFormSubmission: (data: TeachingProfileSchema) => void;
  };
};

export {
  PROFILE_COUNTRY_OPTIONS as countryOptions,
  PROFILE_LANGUAGE_OPTIONS as languageOptions,
  PROFILE_RATE_OPTIONS as rateOptions,
  PROFILE_TIME_ZONE_OPTIONS as timeZoneOptions,
} from "@/configs/options";
