"use client";

import { useTranslations } from "next-intl";
import TuitionRatesByLevel from "./components/all-tuition-rates";
import WhatsAppButton from "@/components/shared/whatapp-button";

const TuitionRatesPage = () => {
  const t = useTranslations("tuitionRates");

  return (
    <div className="px-4 lg:px-8">
      <div className="mx-auto max-w-7xl pb-6 sm:py-10">
        <h2 className="text-3xl font-bold text-center">{t("pageHeading")}</h2>
        <h3 className="mx-auto mt-3 max-w-2xl px-4 sm:px-0 text-sm md:text-base font-normal text-center opacity-50 mb-12">
          {t("pageSubheading")}
        </h3>
        <TuitionRatesByLevel />
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default TuitionRatesPage;
