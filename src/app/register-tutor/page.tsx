"use client";

import RegisterHero from "./components/RegisterHero";
import PersonalInfo from "./components/PersonalInfo";
import TutoringPreferences from "./components/TutoringPreferences";
import AcademicExperience from "./components/AcademicExperience";
import TutorProfile from "./components/TutorProfile";
import TermsAndSubmit from "./components/TermsAndSubmit";

import { useAddTutorRequestMutation } from "@/store/api/splits/tutor-request";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { findMyTutorSchema, FindMyTutorForm } from "./schema";

export default function RegisterTutorPage() {
  const [addTutor, { isLoading }] = useAddTutorRequestMutation();

  const methods = useForm<FindMyTutorForm>({
    resolver: zodResolver(findMyTutorSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      confirmContactNumber: "",
      email: "",
      dateOfBirth: "",
      confirmDateOfBirth: "",
      gender: "Male",
      age: 16,
      nationality: "Singaporean",
      race: "Chinese",
      last4NRIC: "",
      tutoringLevels: [],
      preferredLocations: [],
      tutorType: "",
      yearsExperience: 0,
      highestEducation: "",
      academicDetails: "",
      teachingSummary: "",
      studentResults: "",
      sellingPoints: "",
      agreeTerms: false,
      agreeAssignmentInfo: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FindMyTutorForm) => {
    try {
      await addTutor(data).unwrap();
      alert("Registration submitted successfully!");
      methods.reset();
    } catch (e: any) {
      alert(
        e?.data?.message ||
          e?.error ||
          "There was an error submitting your registration."
      );
    }
  };

  return (
    <>
      <RegisterHero />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <PersonalInfo />
          <TutoringPreferences />
          <AcademicExperience />
          <TutorProfile />
          <TermsAndSubmit
            submitting={isLoading}
            onSubmit={methods.handleSubmit(onSubmit)}
          />
        </form>
      </FormProvider>
    </>
  );
}
