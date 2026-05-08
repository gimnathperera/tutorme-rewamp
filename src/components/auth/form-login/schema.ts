import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is not allowed to be empty" })
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .trim()
    .min(1, { message: "Password is not allowed to be empty" })
    .regex(/^\S+$/, { message: "Password must not contain spaces." })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const initialFormValues = {
  email: "",
  password: "",
} as LoginSchema;
