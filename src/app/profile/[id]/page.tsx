"use client";
import { FC } from "react";
import useLogic from "./hooks/useLogic";
import ProfilePicSettings from "./components/form-profile-pic-settings";
import FormLanguageTime from "./components/form-language-time";
import FormGeneralInfo from "./components/form-general-information";
import FormPasswordInfo from "./components/form-password-information";

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
    <div className="container mx-auto pb-8">
      <div className="mx-auto w-full max-w-7xl py-4">
        <div className="mb-6 text-left">
          <h1 className="text-3xl font-bold text-gray-900">Profile settings</h1>
        </div>

        <div className="space-y-6">
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
    </div>
  );
};

export default ProfilePage;