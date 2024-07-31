import React from "react";
import TutionRates from "./components/get-started";
import Digital from "@/src/components/home-page/digital";
import KeepInTouch from "@/src/components/home-page/keep-in-touch";

const page = () => {
  return (
    <div>
      <TutionRates />
      <Digital />
      <KeepInTouch />
    </div>
  );
};

export default page;
