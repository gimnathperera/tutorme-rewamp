"use client";
import MainForm from "./components/form-find-a-tutor";
import { useTranslations } from "next-intl";

const FindATutorForm = () => {
  const t = useTranslations("findATutor");

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-32 mb-8">
      <p className="font-extrabold text-4xl py-8">{t("heading")}</p>
      <MainForm />
    </div>
  );
};

export default FindATutorForm;
