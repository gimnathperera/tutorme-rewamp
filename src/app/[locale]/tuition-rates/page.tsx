"use client";

import { useTranslations } from "next-intl";
import TuitionRatesByLevel from "./components/all-tuition-rates";
import WhatsAppButton from "@/components/shared/whatapp-button";

const TuitionRatesPage = () => {
  const t = useTranslations("tuitionRates");

  return (
    <div className="m-10">
      <div className="mx-auto max-w-7xl py-4 m-3">
        <h2 className="text-4xl font-bold text-center">
          {t("pageHeading")}
        </h2>
        <h3 className="mx-auto mt-3 max-w-2xl text-xl font-normal text-center opacity-50 mb-12">
          {t("pageSubheading")}
        </h3>
        <TuitionRatesByLevel />
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default TuitionRatesPage;
