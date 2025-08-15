import React from "react";
import TutorDetailsSection from "./components/tutor-details-page";
import TuitionRatesByLevel from "./components/all-tuition-rates";

const TuitionRatesPage = () => {
  return (
    <div className="m-10">
      <div className="mx-auto max-w-7xl py-4 m-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Check the Tuition Rates and Let&apos;s Get Learning!
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
          Explore courses and resources just for you! See the relative tuition
          rates to begin
          <br className="hidden sm:block" />
          an exciting and personalized learning adventure!
        </h3>
      </div>
      <TutorDetailsSection />
      <TuitionRatesByLevel />
    </div>
  );
};

export default TuitionRatesPage;
