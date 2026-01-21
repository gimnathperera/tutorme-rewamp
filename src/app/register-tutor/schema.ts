import { z } from "zod";

export const step1Schema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .regex(/^[A-Za-z\s]+$/, "Full Name can contain letters and spaces only"),
  email: z.string().email("Invalid email"),
  contactNumber: z
    .string()
    .min(10, "Contact Number should be 10 digits")
    .max(10, "Contact Number should be 10 digits"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(["Male", "Female", "Others"]),
  age: z.number().int().min(1).max(80),
  nationality: z.enum(["Sri Lankan", "Others"]),
  race: z.enum(["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"]),
});

export const step2Schema = z.object({
  tutoringLevels: z.array(z.string()).min(1, "Select at least one level"),
  preferredLocations: z
    .array(z.string())
    .min(1, "Select at least one location"),
  tutorType: z.array(z.string()).min(1, "Select at least one tutor type"),
  tutorMediums: z
    .array(z.enum(["Sinhala", "English", "Tamil"]))
    .min(1, "Select at least one medium"),
  highestEducation: z.enum([
    "PhD",
    "Diploma",
    "Masters",
    "Undergraduate",
    "Bachelor Degree",
    "Diploma and Professional",
    "JC/A Levels",
    "Poly",
    "Others",
  ]),
  grades: z.array(z.string()).min(1, "Select at least one grade"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  yearsExperience: z.number().min(0).max(50),
});

export const step3Schema = z.object({
  teachingSummary: z.string().min(1, "Required"),
  studentResults: z.string().min(1, "Required"),
  sellingPoints: z.string().min(1, "Required"),
  academicDetails: z.string().min(1, "Required"),
});

export const step4Schema = z.object({
  certificatesAndQualifications: z.array(z.string()),
  agreeTerms: z.boolean().refine((v) => v, "You must agree to Terms"),
  agreeAssignmentInfo: z
    .boolean()
    .refine((v) => v, "You must confirm assignment info"),
});

export const fullSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

export type FindMyTutorForm = z.infer<typeof fullSchema>;
