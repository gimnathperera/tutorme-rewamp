import { z } from "zod";
import {
  PASSWORD_MIN,
  PASSWORD_MAX,
  PASSWORD_LETTER_NUMBER_REGEX,
} from "../../../configs/password";

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");

export const createSignUpSchema = (t: (_key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .transform(normalizeText)
        .refine((val) => val.length > 0, {
          message: t("nameRequired"),
        })
        .refine((val) => /^[\p{L}\p{M}\s]+$/u.test(val), {
          message: t("nameLettersOnly"),
        }),

      email: z
        .string()
        .trim()
        .toLowerCase()
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

      confirmPassword: z.string().trim().nonempty(t("confirmPasswordRequired")),
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
