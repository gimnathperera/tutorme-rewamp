import { z } from "zod";

export const generalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  region: z.string().min(1, "Region is required"),
  zip: z.string().regex(/^\d{5}$/, "ZIP must be 5 digits"),
  address: z.string().min(1, "Address is required"),
  birthday: z.string().min(1, "Birthday is required"),
  grade: z.string().min(1, "Grade is required"),
  gender: z
    .union([z.enum(["Male", "Female", "None"]), z.literal("")])
    .refine((val) => val !== "", { message: "Gender is required" }),
  tutorType: z.string().min(1, "Tutor type is required"),
  subjects: z.array(z.never()).nonempty("At least one subject is required"),
  duration: z.string().min(1, "Duration is required"),
  frequency: z.string().min(1, "Frequency is required"),
});

export const initialFormValues = {
  firstName: "",
  lastName: "",
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
  subjects: [],
  duration: "",
  frequency: "",
};

export type GeneralInfoSchema = z.infer<typeof generalInfoSchema>;
