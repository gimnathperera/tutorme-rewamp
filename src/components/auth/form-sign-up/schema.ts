import { z } from "zod";
import {
  PASSWORD_MIN,
  PASSWORD_MAX,
  PASSWORD_LETTER_NUMBER_REGEX,
  PASSWORD_TOO_SHORT,
  PASSWORD_TOO_LONG,
  PASSWORD_LETTER_NUMBER_MSG,
} from "../../../configs/password";

// Normalize text: trim + remove extra spaces
const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");

export const signUpSchema = z
  .object({
    name: z
      .string()
      .transform(normalizeText)
      .refine((val) => val.length > 0, {
        message: "Full Name is required",
      })
      .refine((val) => /^[A-Za-z\s]+$/.test(val), {
        message: "Name can contain letters and spaces only",
      }),

    email: z
      .string()
      .trim()
      .nonempty("Email is required.")
      .email({ message: "Invalid email address" }),

    password: z
      .string()
      .trim()
      .nonempty("Password is required.")
      .min(PASSWORD_MIN, { message: PASSWORD_TOO_SHORT })
      .max(PASSWORD_MAX, { message: PASSWORD_TOO_LONG })
      .regex(PASSWORD_LETTER_NUMBER_REGEX, {
        message: PASSWORD_LETTER_NUMBER_MSG,
      }),

    confirmPassword: z
      .string()
      .trim()
      .nonempty("Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const initialFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
