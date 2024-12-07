import { z } from "zod";

export const generalInfoSchema = z.object({
  name: z.string().min(1, "First Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .optional(),
  country: z.string().min(1, "Country is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().min(1, "State is required").optional(),
  region: z.string().min(1, "Region is required").optional(),
  zip: z
    .string()
    .regex(/^\d{5}$/, "ZIP must be 5 digits")
    .optional(),
  address: z.string().min(1, "Address is required").optional(),
  birthday: z.string().min(1, "Birthday is required").optional(),
  grade: z.string().min(1, "Grade is required").optional(),
  gender: z
    .union([z.enum(["Male", "Female", "None"]), z.literal("")])
    .refine((val) => val !== "", { message: "Gender is required" })
    .optional(),
  tutorType: z.string().min(1, "Tutor type is required").optional(),
  subjects: z.array(z.string()).optional(),
  duration: z.string().min(1, "Duration is required").optional(),
  frequency: z.string().min(1, "Frequency is required").optional(),
});

export const initialGeneralInfoFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  country: "",
  city: "",
  state: "",
  region: "",
  zip: "",
  address: "",
  birthday: "",
  grade: "",
  tutorType: "",
  gender: "",
  subjects: [] as unknown,
  duration: "",
  frequency: "",
};

export type GeneralInfoSchema = z.infer<typeof generalInfoSchema>;
