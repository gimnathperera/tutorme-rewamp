import { z } from "zod";
import { addYears, isBefore } from "date-fns";

export const generalInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "First Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name can contain letters and spaces only"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Contact Number is required")
    .regex(/^\d+$/, "Contact Number must contain numeric values only")
    .length(10, "Contact Number should be exactly 10 digits"),
  country: z.string().min(1, "Country is required"),
  city: z
    .string()
    .min(1, "City is required")
    .regex(
      /^[A-Za-z\s]+$/,
      "City cannot contain special characters or numbers",
    ),

  state: z
    .string()
    .min(1, "State is required")
    .regex(
      /^[A-Za-z\s]+$/,
      "State cannot contain special characters or numbers",
    ),

  region: z
    .string()
    .min(1, "Region is required")
    .regex(
      /^[A-Za-z\s]+$/,
      "Region cannot contain special characters or numbers",
    ),
  zip: z
    .string()
    .trim()
    .min(1, "ZIP / Postal code is required")
    .regex(/^\d{5}$/, "Zip/Postal code should be exactly 5 digits"),
  address: z.string().min(1, "Address is required"),
  birthday: z
    .union([z.string(), z.date()])
    .refine((val) => val !== "" && val !== null && val !== undefined, {
      message: "Birthday is required",
    })
    .transform((value) => (value === "" ? undefined : value))
    .refine(
      (date) => {
        if (!date) return true;
        return isBefore(new Date(date), new Date());
      },
      {
        message: "Birthday cannot be a future date",
      },
    )
    .refine(
      (date) => {
        if (!date) return true;
        const today = new Date();
        const minDate = addYears(today, -18);
        return isBefore(new Date(date), minDate);
      },
      {
        message: "You must be at least 18 years old",
      },
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
