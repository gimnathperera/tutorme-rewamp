import React from "react";
import { Separator } from "@/components/ui/separator";
import TutorRatesSection from "./components/tutor-rates";
import TutorDetailsSection from "./components/tutor-details-page";
import KeepInTouch from "@/components/home-page/keep-in-touch";
import PrimaryLevelTuitionRates from "./components/primary-level-rates";
import GradeSixToNineRates from "./components/grade-six-to-ten-rates";
import OrdinaryLevelRates from "./components/odinary-level-rates";
import AdvancedLevelRates from "./components/advanced-level-rates";
import AboutUs from "@/components/home-page/about-us";

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
      <TutorRatesSection />
      <KeepInTouch />
      <PrimaryLevelTuitionRates />
      <GradeSixToNineRates />
      <AboutUs />
      <OrdinaryLevelRates />
      <AdvancedLevelRates />
    </div>
  );
};

export default TuitionRatesPage;
