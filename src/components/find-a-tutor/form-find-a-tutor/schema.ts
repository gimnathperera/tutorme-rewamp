import { z } from "zod";

export const tutorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  grade: z.string().min(1, "Grade is required"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  region: z.string().min(1, "Region is required"),
  zip: z.string().regex(/^\d{5}$/, "Zip must be a valid 5-digit number"),
  tutorType: z.string().min(1, "Tutor type is required"),
  school: z.string().min(1, "School is required"),
  genderPreference: z.enum(["Male", "Female", "None"]),
  bilingualTutor: z.enum(["Yes", "No"]),
  tutorCount: z
    .string()
    .min(1, "Tutor count is required")
    .transform((value) => parseInt(value, 10))
    .refine((value) => value >= 1, {
      message: "Tutor count must be at least 1",
    }),
  tutors: z
    .array(
      z.object({
        subjects: z
          .array(z.string())
          .nonempty("Subjects array cannot be empty"),
        duration: z.string().min(1, "Duration must be at least 1 hour"),
        frequency: z.string().min(1, "Frequency must be at least 1 session"),
      })
    )
    .nonempty("There must be at least one tutor"),
});

export type TutorSchema = z.infer<typeof tutorSchema>;
