import { z } from "zod";

export const passwordInfoSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-z]/, { message: "Must include at least one lowercase letter" })
      .regex(/[A-Z]/, { message: "Must include at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Must include at least one number" })
      .regex(/[#@$&]/, {
        message: "Must include at least one special symbol (#, @, $, &)",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm Password must match New Password",
    path: ["confirmPassword"],
  });

export type PasswordInfoSchema = z.infer<typeof passwordInfoSchema>;
