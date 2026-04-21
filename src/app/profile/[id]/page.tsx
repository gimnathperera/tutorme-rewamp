"use client";
import { FC } from "react";
import useLogic from "./hooks/useLogic";
import ProfilePicSettings from "./components/form-profile-pic-settings";
import FormLanguageTime from "./components/form-language-time";
import FormGeneralInfo from "./components/form-general-information";
import FormPasswordInfo from "./components/form-password-information";
import WhatsAppButton from "@/components/shared/whatapp-button";

const ProfilePage: FC = () => {
  const {
    derivedData: {
      dropdownOptionData,
      loading: { isGeneralFormSubmitting },
    },
    forms: { generalInfoForm, languageAndTimeForm },
    handlers: { onGeneralInfoFormSubmission, onLanguageAndTimeFormSubmission },
  } = useLogic();

  return (
    <div className="container mx-auto py-4">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 sm:py-6">
        <div className="mb-5 text-left sm:mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Profile settings
          </h1>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <ProfilePicSettings />

          <FormLanguageTime
            timeZoneOptions={dropdownOptionData.timeZoneOptions}
            languageOptions={dropdownOptionData.languageOptions}
            form={languageAndTimeForm}
            onFormSubmit={onLanguageAndTimeFormSubmission}
            isSubmitting={isGeneralFormSubmitting}
          />

          <FormGeneralInfo
            dropdownOptionData={dropdownOptionData}
            form={generalInfoForm}
            onFormSubmit={onGeneralInfoFormSubmission}
            isSubmitting={isGeneralFormSubmitting}
          />

          <FormPasswordInfo />
        </div>
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default ProfilePage;
