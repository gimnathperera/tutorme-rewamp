"use client";
import { FC } from "react";
import useLogic from "./hooks/useLogic";
import ProfilePicSettings from "./components/form-profile-pic-settings";
import FormLanguageTime from "./components/form-language-time";
import SocialAccounts from "./components/form-social-accounts";
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
    <div className="container pb-8">
      <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4">
        <div className="mb-4 col-span-full xl:mb-2">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl ">
            Profile settings
          </h1>
        </div>
        <div className="col-span-full xl:col-auto">
          <ProfilePicSettings />

          <FormLanguageTime
            timeZoneOptions={dropdownOptionData.timeZoneOptions}
            languageOptions={dropdownOptionData.languageOptions}
            form={languageAndTimeForm}
            onFormSubmit={onLanguageAndTimeFormSubmission}
            isSubmitting={isGeneralFormSubmitting}
          />

          <SocialAccounts />
        </div>
        <div className="col-span-2">
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
