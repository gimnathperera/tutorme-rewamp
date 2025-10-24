import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is not allowed to be empty" }),

  password: z
    .string()
    .min(1, { message: "Password is not allowed to be empty" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const initialFormValues = {
  email: "",
  password: "",
} as LoginSchema;
