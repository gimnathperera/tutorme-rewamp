"use client";
import { FC } from "react";
import useLogic from "./hooks/useLogic";
import ProfilePicSettings from "./components/form-profile-pic-settings";
import FormLanguageTime from "./components/form-language-time";
import FormGeneralInfo from "./components/form-general-information";
import FormEducationInfo from "./components/form-education-information";
import FormPasswordInfo from "./components/form-password-information";
import AdminProfileOverview from "./components/admin-profile-overview";
import FormTeachingProfile from "./components/form-teaching-profile";
import WhatsAppButton from "@/components/shared/whatapp-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarClock,
  GraduationCap,
  PenLine,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const ProfilePage: FC = () => {
  const {
    derivedData: {
      dropdownOptionData,
      profileData,
      currentUser,
      isAdminProfile,
      loading: { isGeneralFormSubmitting, isProfileDataLoading },
    },
    forms: {
      generalInfoForm,
      educationInfoForm,
      languageAndTimeForm,
      teachingProfileForm,
    },
    handlers: {
      onGeneralInfoFormSubmission,
      onEducationInfoFormSubmission,
      onLanguageAndTimeFormSubmission,
      onTeachingProfileFormSubmission,
    },
  } = useLogic();

  return (
    <div className="container mx-auto py-4">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 sm:py-6">
        <div className="mb-5 text-left sm:mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {isAdminProfile ? "Admin Profile" : "Tutor Profile"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600 sm:text-base">
            {isAdminProfile
              ? "View your admin account information without leaving the tutor portal."
              : "Manage your tutor profile by section so it is easier to update your personal details, qualifications, availability, and security settings."}
          </p>
        </div>

        {isAdminProfile ? (
          <AdminProfileOverview
            profile={profileData}
            currentUser={currentUser}
            isLoading={isProfileDataLoading}
          />
        ) : (
          <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
            <div className="w-full sm:border-none sm:bg-transparent sm:p-0 sm:shadow-none">
              <TabsList className="flex h-auto w-full flex-nowrap items-center justify-start gap-2 overflow-x-auto bg-transparent p-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
                <TabsTrigger
                  value="profile"
                  className="m-0 min-w-fit shrink-0 justify-center gap-2 whitespace-nowrap rounded-3xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-600 shadow-none data-[state=active]:border-primary-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-none sm:justify-start sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-left"
                >
                  <UserRound className="h-4 w-4 shrink-0" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="qualifications"
                  className="m-0 min-w-fit shrink-0 justify-center gap-2 whitespace-nowrap rounded-3xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-600 shadow-none data-[state=active]:border-primary-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-none sm:justify-start sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-left"
                >
                  <GraduationCap className="h-4 w-4 shrink-0" />
                  Qualifications
                </TabsTrigger>
                <TabsTrigger
                  value="languages"
                  className="m-0 min-w-fit shrink-0 justify-center gap-2 whitespace-nowrap rounded-3xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-600 shadow-none data-[state=active]:border-primary-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-none sm:justify-start sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-left"
                >
                  <CalendarClock className="h-4 w-4 shrink-0" />
                  <span className="sm:hidden">Availability</span>
                  <span className="hidden sm:inline">
                    Languages, Availability & Rate
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="teaching"
                  className="m-0 min-w-fit shrink-0 justify-center gap-2 whitespace-nowrap rounded-3xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-600 shadow-none data-[state=active]:border-primary-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-none sm:justify-start sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-left"
                >
                  <PenLine className="h-4 w-4 shrink-0" />
                  Teaching Profile
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="m-0 min-w-fit shrink-0 justify-center gap-2 whitespace-nowrap rounded-3xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-600 shadow-none data-[state=active]:border-primary-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-800 data-[state=active]:shadow-none sm:justify-start sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-left"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  Security
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="profile"
              className="mt-0 space-y-4 sm:space-y-6"
            >
              <ProfilePicSettings />
              <FormGeneralInfo
                form={generalInfoForm}
                onFormSubmit={onGeneralInfoFormSubmission}
                isSubmitting={isGeneralFormSubmitting}
              />
            </TabsContent>

            <TabsContent
              value="qualifications"
              className="mt-0 space-y-4 sm:space-y-6"
            >
              <FormEducationInfo
                dropdownOptionData={{
                  gradesOptions: dropdownOptionData.gradesOptions,
                  subjectsOptions: dropdownOptionData.educationSubjectsOptions,
                }}
                form={educationInfoForm}
                onFormSubmit={onEducationInfoFormSubmission}
                isSubmitting={isGeneralFormSubmitting}
              />
            </TabsContent>

            <TabsContent
              value="languages"
              className="mt-0 space-y-4 sm:space-y-6"
            >
              <FormLanguageTime
                timeZoneOptions={dropdownOptionData.timeZoneOptions}
                languageOptions={dropdownOptionData.languageOptions}
                rateOptions={dropdownOptionData.rateOptions}
                form={languageAndTimeForm}
                onFormSubmit={onLanguageAndTimeFormSubmission}
                isSubmitting={isGeneralFormSubmitting}
              />
            </TabsContent>

            <TabsContent
              value="teaching"
              className="mt-0 space-y-4 sm:space-y-6"
            >
              <FormTeachingProfile
                form={teachingProfileForm}
                onFormSubmit={onTeachingProfileFormSubmission}
                isSubmitting={isGeneralFormSubmitting}
              />
            </TabsContent>

            <TabsContent
              value="security"
              className="mt-0 space-y-4 sm:space-y-6"
            >
              <FormPasswordInfo />
            </TabsContent>
          </Tabs>
        )}
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default ProfilePage;
