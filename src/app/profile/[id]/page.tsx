"use client";
import { FC } from "react";
import useLogic from "./hooks/useLogic";
import ProfilePicSettings from "./components/form-profile-pic-settings";
import FormLanguageTime from "./components/form-language-time";
import FormGeneralInfo from "./components/form-general-information";
import FormEducationInfo from "./components/form-education-information";
import FormPasswordInfo from "./components/form-password-information";
import WhatsAppButton from "@/components/shared/whatapp-button";

const ProfilePage: FC = () => {
  const {
    derivedData: {
      dropdownOptionData,
      loading: { isGeneralFormSubmitting },
    },
    forms: { generalInfoForm, educationInfoForm, languageAndTimeForm },
    handlers: {
      onGeneralInfoFormSubmission,
      onEducationInfoFormSubmission,
      onLanguageAndTimeFormSubmission,
    },
  } = useLogic();

  return (
    <div className="container mx-auto py-4">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 sm:py-6">
        <div className="mb-5 text-left sm:mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Tutor Profile
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600 sm:text-base">
            Update the key details parents and students use to evaluate your
            teaching profile, experience, qualifications, and availability.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <ProfilePicSettings />

          <FormGeneralInfo
            dropdownOptionData={dropdownOptionData}
            form={generalInfoForm}
            onFormSubmit={onGeneralInfoFormSubmission}
            isSubmitting={isGeneralFormSubmitting}
          />

          <FormEducationInfo
            dropdownOptionData={{
              gradesOptions: dropdownOptionData.gradesOptions,
              subjectsOptions: dropdownOptionData.educationSubjectsOptions,
            }}
            form={educationInfoForm}
            onFormSubmit={onEducationInfoFormSubmission}
            isSubmitting={isGeneralFormSubmitting}
          />

          <FormLanguageTime
            timeZoneOptions={dropdownOptionData.timeZoneOptions}
            languageOptions={dropdownOptionData.languageOptions}
            form={languageAndTimeForm}
            onFormSubmit={onLanguageAndTimeFormSubmission}
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
