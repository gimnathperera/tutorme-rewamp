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

  gender: z.string().refine((v) => ["Male", "Female", "Others"].includes(v), {
    message: "Please select a valid gender",
  }),

  age: z.number().int().min(1).max(80, "Age must be below 80"),

  nationality: z.string().refine((v) => ["Sri Lankan", "Others"].includes(v), {
    message: "Please select nationality",
  }),

  race: z
    .string()
    .refine(
      (v) => ["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"].includes(v),
      {
        message: "Please select race",
      },
    ),
});

export const step2Schema = z.object({
  tutoringLevels: z
    .array(z.string())
    .min(1, "Select at least one tutoring level"),

  preferredLocations: z
    .array(z.string())
    .min(1, "Select at least one location"),

  tutorType: z.array(z.string()).min(1, "Select at least one tutor type"),

  tutorMediums: z
    .array(
      z.string().refine((v) => ["Sinhala", "English", "Tamil"].includes(v), {
        message: "Invalid medium selected",
      }),
    )
    .min(1, "Select at least one medium"),

  highestEducation: z
    .string()
    .refine(
      (v) =>
        [
          "PhD",
          "Masters",
          "Bachelor Degree",
          "Undergraduate",
          "Diploma and Professional",
          "AL",
        ].includes(v),
      {
        message: "Please select highest education level",
      },
    ),

  grades: z.array(z.string()).min(1, "Select at least one grade"),

  subjects: z.array(z.string()).min(1, "Select at least one subject"),

  yearsExperience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
});

export const step3Schema = z.object({
  teachingSummary: z.string().min(1, "Required"),
  studentResults: z.string().min(1, "Required"),
  sellingPoints: z.string().min(1, "Required"),
  academicDetails: z.string().min(1, "Required"),
});

export const step4Schema = z.object({
  certificatesAndQualifications: z
    .array(z.string())
    .min(1, "Upload at least one certificate or qualification"),
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
