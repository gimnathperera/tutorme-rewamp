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
import toast from "react-hot-toast";

export default function RegisterTutorPage() {
  const [addTutor, { isLoading }] = useAddTutorRequestMutation();

  const methods = useForm<FindMyTutorForm>({
    resolver: zodResolver(findMyTutorSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",

      email: "",
      dateOfBirth: "",

      gender: "Male",
      age: 18,
      nationality: "Singaporean",
      race: "Chinese",
      last4NRIC: "",
      tutoringLevels: [],
      preferredLocations: [],
      tutorMediums: [], 
      grades: [], 
      subjects: [],
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
      toast.success("Registration submitted successfully!");
      methods.reset();
    } catch (e: any) {
      toast.error(
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
          {/* Add reset button next to submit in TermsAndSubmit */}
          <TermsAndSubmit
            submitting={isLoading}
            onSubmit={methods.handleSubmit(onSubmit)}
            resetForm={() => {
              methods.reset();
              toast.success("Form has been reset.");
            }}
          />
        </form>
      </FormProvider>
    </>
  );
}
