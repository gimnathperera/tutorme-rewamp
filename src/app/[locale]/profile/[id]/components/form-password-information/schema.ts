import { z } from "zod";
import {
  PASSWORD_MIN,
  PASSWORD_MAX,
  PASSWORD_LETTER_NUMBER_REGEX,
} from "@/configs/password";
import { removeWhitespace } from "@/utils/form-normalizers";

export const createPasswordInfoSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z.preprocess(
        removeWhitespace,
        z.string().min(1, { message: t("passwordRequired") }),
      ),
      newPassword: z.preprocess(
        removeWhitespace,
        z
          .string()
          .min(PASSWORD_MIN, { message: t("passwordTooShort") })
          .max(PASSWORD_MAX, { message: t("passwordTooLong") })
          .regex(PASSWORD_LETTER_NUMBER_REGEX, {
            message: t("passwordLetterNumber"),
          }),
      ),
      confirmPassword: z.preprocess(
        removeWhitespace,
        z.string().min(PASSWORD_MIN, { message: t("passwordTooShort") }),
      ),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("confirmPasswordMismatch"),
      path: ["confirmPassword"],
    });

export type PasswordInfoSchema = z.infer<
  ReturnType<typeof createPasswordInfoSchema>
>;

export const initialFormValues: PasswordInfoSchema = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
