import { z } from "zod";

export const step1Schema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .regex(/^[A-Za-z\s]+$/, "Full Name can contain letters and spaces only"),

  email: z.string().email("Invalid email"),

  contactNumber: z
    .string()
    .trim()
    .min(1, "Contact Number is required")
    .regex(/^\d{10}$/, "Contact Number should be exactly 10 digits"),

  dateOfBirth: z.string().min(1, "Date of Birth is required"),

  gender: z.string().refine((v) => ["Male", "Female", "Others"].includes(v), {
    message: "Gender is required",
  }),

  age: z.number().int().min(18, "You must be at least 18 years old").max(80, "Age must be below 80"),

  nationality: z.string().refine((v) => ["Sri Lankan", "Others"].includes(v), {
    message: "Nationality is required",
  }),

  race: z
    .string()
    .refine(
      (v) => ["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"].includes(v),
      {
        message: "Race is required",
      },
    ),
});

export const step2Schema = z.object({
  tutoringLevels: z
    .array(z.string())
    .min(1, "Tutoring Levels are required"),

  preferredLocations: z
    .array(z.string())
    .min(1, "Preferred Locations are required"),

  tutorType: z.array(z.string()).min(1, "Tutor Types are required"),

  tutorMediums: z
    .array(
      z.string().refine((v) => ["Sinhala", "English", "Tamil"].includes(v), {
        message: "Invalid medium selected",
      }),
    )
    .min(1, "Tutor Mediums are required"),

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
        message: "Highest Education is required",
      },
    ),

  grades: z.array(z.string()).min(1, "Grades are required"),

  subjects: z.array(z.string()).min(1, "Subjects are required"),

  yearsExperience: z
    .number()
    .min(1, "Years of Experience is required")
    .max(50, "Experience cannot exceed 50 years"),
});

export const step3Schema = z.object({
  teachingSummary: z.string().min(1, "Teaching Summary is required"),
  studentResults: z.string().min(1, "Student Results is required"),
  sellingPoints: z.string().min(1, "Selling Points is required"),
  academicDetails: z.string().min(1, "Academic Details is required"),
});

export const step4Schema = z.object({
  certificatesAndQualifications: z
    .array(z.string())
    .min(1, "Certificates and Qualifications are required"),
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
