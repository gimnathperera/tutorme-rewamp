import { z } from "zod";

export const createRequestTutorSchema = z.object({
  name: z.string().min(1, "First Name is required"),
  email: z.string().min(1, "Enter a valid email").email("Enter a valid email"),
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
        duration: z.string().nonempty("Please select a duration"),
        frequency: z.string().nonempty("Please select a frequency"),
        preferredTutorType: z.string().nonempty("Please select a tutor type"),
        subjects: z
          .array(z.string())
          .min(1, "Please select at least one subject"),
      })
    )
    .min(1, "Tutor count is required"),
});

export type CreateRequestTutorSchema = z.infer<typeof createRequestTutorSchema>;

export const initialFormValues: CreateRequestTutorSchema = {
  name: "",
  medium: "",
  email: "",
  phoneNumber: "",
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
