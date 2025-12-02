import { z } from "zod";

export const passwordInfoSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty({ message: "Current password is required" }),

    newPassword: z
      .string()
      .nonempty({ message: "New password is required." })
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(12, { message: "Password cannot exceed 12 characters" })
      .superRefine((val, ctx) => {
        const hasLetter = /[a-zA-Z]/.test(val);
        const hasNumber = /\d/.test(val);

        if (!hasLetter || !hasNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least 1 letter and 1 number",
          });
        }
      }),

    confirmPassword: z
      .string()
      .nonempty({ message: "Please confirm your new password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm Password must match New Password",
    path: ["confirmPassword"],
  });

export type PasswordInfoSchema = z.infer<typeof passwordInfoSchema>;

export const initialFormValues: PasswordInfoSchema = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
