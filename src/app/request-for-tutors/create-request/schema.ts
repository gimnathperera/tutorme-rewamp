import { z } from "zod";

export const createRequestTutorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone Number must contain numeric values only")
    .refine((val) => val.length === 10, {
      message: "Phone number must be exactly 10 digits",
    }),
  medium: z.string().nonempty("Medium is required"),
  grade: z.string().nonempty("Grade is required"),
  tutors: z
    .array(
      z.object({
        subject: z.string().nonempty("Subject is required"),
        assignedTutor: z.string().optional().default(""),
        duration: z.string().nonempty("Duration is required"),
        frequency: z.string().nonempty("Frequency is required"),
        preferredTutorType: z.string().nonempty("Tutor type is required"),
      })
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
  grade: "",
  tutors: [
    {
      subject: "",
      assignedTutor: "",
      duration: "",
      frequency: "",
      preferredTutorType: "",
    },
  ],
};
