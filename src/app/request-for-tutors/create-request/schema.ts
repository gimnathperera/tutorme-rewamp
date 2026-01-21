import { z } from "zod";

export const createRequestTutorSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Full Name can contain letters and spaces only"),
  email: z.string().min(1, "Enter a valid email").email("Enter a valid email"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone Number must contain numeric values only")
    .refine((val) => val.length === 10, {
      message: "Phone number must be exactly 10 digits",
    }),
  medium: z.string().nonempty("Please select a medium"),
  grade: z.array(z.string()).min(1, "Please select at least one grade"),
  tutors: z
    .array(
      z.object({
        subjects: z
          .array(z.string())
          .min(1, "Please select at least one subject"),
        duration: z.string().nonempty("Duration is required"),
        frequency: z.string().nonempty("Frequency is required"),
        preferredTutorType: z.string().nonempty("Please select a tutor type"),
      }),
    )
    .min(1, "Tutor count is required"),
});

export type CreateRequestTutorSchema = z.infer<typeof createRequestTutorSchema>;

export const initialFormValues: CreateRequestTutorSchema = {
  name: "",
  email: "",
  phoneNumber: "",
  city: "",
  district: "",
  medium: "",
  grade: [],
  tutors: [
    {
      subjects: [],
      duration: "",
      frequency: "",
      preferredTutorType: "",
    },
  ],
};
