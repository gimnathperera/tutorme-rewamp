import { z } from "zod";
import {
  PASSWORD_MIN,
  PASSWORD_MAX,
  PASSWORD_LETTER_NUMBER_REGEX,
} from "../../../configs/password";

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");

export const createSignUpSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .transform(normalizeText)
        .refine((val) => val.length > 0, {
          message: t("nameRequired"),
        })
        .refine((val) => /^[A-Za-z\s]+$/.test(val), {
          message: t("nameLettersOnly"),
        }),

      email: z
        .string()
        .trim()
        .nonempty(t("emailRequired"))
        .email({ message: t("emailInvalid") }),

      password: z
        .string()
        .trim()
        .nonempty(t("passwordRequired"))
        .min(PASSWORD_MIN, { message: t("passwordTooShort") })
        .max(PASSWORD_MAX, { message: t("passwordTooLong") })
        .regex(PASSWORD_LETTER_NUMBER_REGEX, {
          message: t("passwordLetterNumber"),
        }),

      confirmPassword: z
        .string()
        .trim()
        .nonempty(t("confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsNoMatch"),
      path: ["confirmPassword"],
    });

export type SignUpSchema = z.infer<ReturnType<typeof createSignUpSchema>>;

export const initialFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
