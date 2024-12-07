"use client";
import FormGeneralInfo from "@/components/profile/form-general-information";
import FormLanguageTime from "@/components/profile/form-language-time";
import FormPasswordInfo from "@/components/profile/form-password-information";
import { FC } from "react";
import ProfilePicSettings from "./components/profile-pic-settings";
import SocialAccounts from "./components/social-accounts";
import useLogic from "./hooks/useLogic";

const ProfilePage: FC = () => {
  const { derivedData } = useLogic();

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

          <FormLanguageTime />

          <SocialAccounts />
        </div>
        <div className="col-span-2">
          <FormGeneralInfo />
          <FormPasswordInfo />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
