import React from "react";
import Filter from "./components/filter";
import { getTranslations } from "next-intl/server";

const TuitionAssignments = async () => {
  const t = await getTranslations("tuitionAssignments");

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-8 md:px-16 lg:px-32 py-10 rounded-2xl">
      <p className="font-extrabold text-3xl sm:text-4xl py-6 text-center">
        {t("heading")}
      </p>
      <Filter />
    </div>
  );
};

export default TuitionAssignments;
