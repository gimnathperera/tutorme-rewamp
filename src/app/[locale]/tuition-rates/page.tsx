"use client";

import { useTranslations } from "next-intl";
import TuitionRatesByLevel from "./components/all-tuition-rates";
import WhatsAppButton from "@/components/shared/whatapp-button";

const TuitionRatesPage = () => {
  const t = useTranslations("tuitionRates");

  return (
    <div className="m-10">
      <div className="mx-auto max-w-7xl py-4 m-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {t("pageHeading")}
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50 mb-12">
          {t("pageSubheading")}
        </h3>
        <TuitionRatesByLevel />
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default TuitionRatesPage;
