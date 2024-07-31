import React from "react";
import TutionRates from "./components/get-started";
import Digital from "@/src/components/home-page/digital";
import KeepInTouch from "@/src/components/home-page/keep-in-touch";

const Page = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <TutionRates />
        <Digital />
        <KeepInTouch />
      </div>
    </div>
  );
};

export default Page;
