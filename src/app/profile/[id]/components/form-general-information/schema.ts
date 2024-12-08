import { z } from "zod";
import { addYears, isBefore } from "date-fns";

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
  birthday: z
    .union([z.string(), z.date()])
    .optional()
    .transform((value) => (value === "" ? undefined : value))
    .refine(
      (date) => {
        if (!date) return true; // Allow undefined values
        const today = new Date();
        const minDate = addYears(today, -18);
        return isBefore(new Date(date), minDate);
      },
      {
        message: "You must be at least 18 years old",
      }
    ),
  gender: z
    .union([z.enum(["Male", "Female", "None"]), z.literal("")])
    .refine((val) => val !== "", { message: "Gender is required" })
    .optional(),
  tutorType: z.string().min(1, "Tutor type is required").optional(),
  grades: z.array(z.string()).optional(),
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
  birthday: "" as any, //TODO: fix the type issue here
  tutorType: "",
  gender: "",
  grades: [] as unknown,
  subjects: [] as unknown,
  duration: "",
  frequency: "",
};

export type GeneralInfoSchema = z.infer<typeof generalInfoSchema>;
