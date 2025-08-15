"use client";

import { useCallback, useMemo, useState } from "react";
import RegisterHero from "./components/RegisterHero";
import PersonalInfo from "./components/PersonalInfo";
import TutoringPreferences from "./components/TutoringPreferences";
import AcademicExperience from "./components/AcademicExperience";
import TutorProfile from "./components/TutorProfile";
import TermsAndSubmit from "./components/TermsAndSubmit";
import { FindMyTutorRequest } from "@/types/request-types";
import { useAddTutorRequestMutation } from "@/store/api/splits/tutor-request";

const initialForm: FindMyTutorRequest = {
  fullName: "",
  contactNumber: "",
  confirmContactNumber: "",
  email: "",
  dateOfBirth: "",
  confirmDateOfBirth: "",
  gender: "",
  age: 0,
  nationality: "",
  race: "",
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
  captchaToken: "",
};

export default function RegisterTutorPage() {
  const [formData, setFormData] = useState<FindMyTutorRequest>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addTutor, { isLoading }] = useAddTutorRequestMutation();

  const setField = useCallback(
    (name: keyof FindMyTutorRequest, value: any) => {
      setFormData((p) => ({ ...p, [name]: value }));
      if (errors[name as string]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  // ---- Field validators ----
  const validators: Record<keyof FindMyTutorRequest, (v: any) => string> =
    useMemo(
      () => ({
        fullName: (v) =>
          !v?.trim()
            ? "Full name is required"
            : v.length < 2
            ? "Name must be at least 2 characters"
            : "",
        contactNumber: (v) =>
          !v?.trim()
            ? "Contact number is required"
            : !/^\d{8}$/.test(String(v))
            ? "Enter valid 8-digit contact number"
            : "",
        confirmContactNumber: (v) =>
          v !== formData.contactNumber ? "Contact numbers do not match" : "",
        email: (v) =>
          !v?.trim()
            ? "Email is required"
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
            ? "Enter valid email"
            : "",
        dateOfBirth: (v) => (!v ? "Date of birth is required" : ""),
        confirmDateOfBirth: (v) =>
          v !== formData.dateOfBirth ? "Dates of birth do not match" : "",
        gender: (v) => (!v ? "Gender is required" : ""),
        age: (v) =>
          !v && v !== 0
            ? "Age is required"
            : Number(v) < 16 || Number(v) > 80
            ? "Age must be between 16-80"
            : "",
        nationality: (v) => (!v ? "Nationality is required" : ""),
        race: (v) => (!v ? "Race is required" : ""),
        last4NRIC: (v) =>
            !v?.trim()
              ? "Last 4 digits of NRIC is required"
              : !/^\d{4}$/.test(String(v))
              ? "Enter exactly 4 digits"
              : "",
        tutoringLevels: (v) =>
          !Array.isArray(v) || v.length === 0
            ? "Select at least one level"
            : "",
        preferredLocations: (_) => "",
        tutorType: (v) => (!v ? "Tutor type is required" : ""),
        yearsExperience: (v) =>
          v === undefined || v === null || v === ""
            ? "Experience is required"
            : "",
        highestEducation: (v) => (!v ? "Highest education is required" : ""),
        academicDetails: (v) =>
          !v?.trim() ? "Academic details are required" : "",
        teachingSummary: (v) =>
          !v?.trim() ? "Teaching summary is required" : "",
        studentResults: (v) =>
          !v?.trim() ? "Student results are required" : "",
        sellingPoints: (v) =>
          !v?.trim() ? "Selling points are required" : "",
        agreeTerms: (v) => (v ? "" : "You must agree to Terms & Conditions"),
        agreeAssignmentInfo: (v) =>
          v ? "" : "You must agree to receive assignment info",
        captchaToken: (v) => (!v?.trim() ? "Captcha verification required" : ""),
      }),
      [formData.contactNumber, formData.dateOfBirth]
    );

  const validateField = useCallback(
    (name: keyof FindMyTutorRequest) => {
      const fn = validators[name];
      if (!fn) return true;
      const msg = fn((formData as any)[name]);
      setErrors((prev) => ({ ...prev, [name]: msg }));
      return !msg;
    },
    [formData, validators]
  );

  const validateAll = useCallback(() => {
    const nextErrors: Record<string, string> = {};
    (Object.keys(validators) as (keyof FindMyTutorRequest)[]).forEach((k) => {
      const msg = validators[k]((formData as any)[k]);
      if (msg) nextErrors[k as string] = msg;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [formData, validators]);

  const handleSubmit = useCallback(async () => {
    // Prevent submitting empty form: force full validation
    if (!validateAll()) {
      // Focus the first error field optionally (not implemented here)
      return;
    }
    try {
      await addTutor(formData).unwrap();
      alert("Registration submitted successfully!");
      setFormData(initialForm);
      setErrors({});
    } catch (e: any) {
      const apiMsg =
        e?.data?.message ||
        e?.error ||
        "There was an error submitting your registration.";
      alert(apiMsg);
    }
  }, [addTutor, formData, validateAll]);

  return (
    <>
      <RegisterHero />
      <PersonalInfo
        data={formData}
        errors={errors}
        setField={setField}
        validateField={validateField}
      />
      <TutoringPreferences
        data={formData}
        errors={errors}
        setField={setField}
        validateField={validateField}
      />
      <AcademicExperience
        data={formData}
        errors={errors}
        setField={setField}
        validateField={validateField}
      />
      <TutorProfile
        data={formData}
        errors={errors}
        setField={setField}
        validateField={validateField}
      />
      <TermsAndSubmit
        data={formData}
        errors={errors}
        setField={setField}
        validateField={validateField}
        onSubmit={handleSubmit}
        submitting={isLoading}
      />
    </>
  );
}
