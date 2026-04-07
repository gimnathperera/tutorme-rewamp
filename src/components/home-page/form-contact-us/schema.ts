import { z } from "zod";

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");

export const contactUsSchema = z.object({
  name: z
    .string()
    .transform(normalizeText)
    .refine((val) => val.length > 0, {
      message: "Full Name is required",
    }),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Invalid email address"),

  message: z
    .string()
    .transform(normalizeText)
    .refine((val) => val.length > 0, {
      message: "Message is required.",
    }),
});

export type ContactUsSchema = z.infer<typeof contactUsSchema>;

export const initialFormValues = {
  name: "",
  email: "",
  message: "",
};
