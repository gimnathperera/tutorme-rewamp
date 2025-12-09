import { z } from "zod";
import {
  PASSWORD_MIN,
  PASSWORD_MAX,
  PASSWORD_LETTER_NUMBER_REGEX,
  PASSWORD_TOO_SHORT,
  PASSWORD_TOO_LONG,
  PASSWORD_LETTER_NUMBER_MSG,
  CURRENT_PASSWORD_REQUIRED,
} from "../../../../../configs/password";

export const passwordInfoSchema = z
  .object({
    currentPassword: z.string().min(1, { message: CURRENT_PASSWORD_REQUIRED }),

    newPassword: z
      .string()
      .min(PASSWORD_MIN, { message: PASSWORD_TOO_SHORT })
      .max(PASSWORD_MAX, { message: PASSWORD_TOO_LONG })
      .regex(PASSWORD_LETTER_NUMBER_REGEX, {
        message: PASSWORD_LETTER_NUMBER_MSG,
      }),

    confirmPassword: z
      .string()
      .min(PASSWORD_MIN, { message: PASSWORD_TOO_SHORT }),
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
