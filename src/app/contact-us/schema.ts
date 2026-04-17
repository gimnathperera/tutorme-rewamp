import { z } from "zod";

export const contactUsPageSchema = z.object({
  name: z
    .string()
    .min(1, "Full Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name can contain letters and spaces only"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Contact Number must be exactly 10 digits"),

  message: z.string().min(1, "Message is required"),
});

export const initialFormValues = {
  name: "",
  email: "",
  contactNumber: "",
  message: "",
};

export type ContactUsPageSchema = z.infer<typeof contactUsPageSchema>;
