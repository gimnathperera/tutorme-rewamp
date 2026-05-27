import { removeWhitespace } from "@/utils/form-normalizers";
import { z } from "zod";

export const contactUsPageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name can contain letters and spaces only")
    .refine(
      (v) => !/ {2,}/.test(v),
      "Multiple consecutive spaces are not allowed",
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  contactNumber: z.preprocess(
    removeWhitespace,
    z
      .string()
      .min(1, "Contact Number is required")
      .regex(/^\d+$/, "Contact Number must contain numeric values only")
      .length(10, "Contact Number should be exactly 10 digits"),
  ),

  message: z.string().trim().min(1, "Message is required"),
});

export const initialFormValues = {
  name: "",
  email: "",
  contactNumber: "",
  message: "",
};

export type ContactUsPageSchema = z.infer<typeof contactUsPageSchema>;
