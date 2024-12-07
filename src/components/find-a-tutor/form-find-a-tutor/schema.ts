import { z } from "zod";

export const tutorSchema = z.object({
  name: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
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
  genderPreference: z
    .union([z.enum(["Male", "Female", "None"]), z.literal("")])
    .refine((val) => val !== "", { message: "Gender Preference is required" }),
  bilingualTutor: z
    .union([z.enum(["Yes", "No"]), z.literal("")])
    .refine((val) => val !== "", { message: "Bilingual Tutor is required" }),
  tutorCount: z.string().min(1, "Tutor count is required"),
  tutors: z
    .array(
      z.object({
        subjects: z.array(z.never()).nonempty("Subjects array cannot be empty"),
        duration: z.string().min(1, "Duration is required"),
        frequency: z.string().min(1, "Frequency is required"),
      })
    )
    .nonempty("There must be at least one tutor"),
});

export const initialFormValues = {
  name: "",
  lastName: "",
  email: "",
  grade: "",
  phoneNumber: "",
  city: "",
  state: "",
  region: "",
  zip: "",
  tutorType: "",
  school: "",
  genderPreference: "",
  bilingualTutor: "",
  tutorCount: "1",
  tutors: [
    {
      subjects: [],
      duration: "",
      frequency: "",
    },
  ],
};

export type TutorSchema = z.infer<typeof tutorSchema>;
