import { z } from "zod";

export const passwordInfoSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type PasswordInfoSchema = z.infer<typeof passwordInfoSchema>;
