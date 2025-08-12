"use client";
import { useState } from "react";
import PersonalInfo from "./components/PersonalInfo";
import TutoringPreferences from "./components/TutoringPreferences";
import AcademicExperience from "./components/AcademicExperience";
import TutorProfile from "./components/TutorProfile";
import TermsAndSubmit from "./components/TermsAndSubmit";
import RegisterHero from "./components/RegisterHero";

export default function RegisterTutor() {
  return (
    <>
      <RegisterHero />
      <PersonalInfo />
      <TutoringPreferences />
      <AcademicExperience />
      <TutorProfile />
      <TermsAndSubmit />
    </>
  );
}