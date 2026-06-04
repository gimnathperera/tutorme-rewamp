import { z } from "zod";

export const createLoginSchema = (t: (_key: string) => string) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: t("emailRequired") })
      .email({ message: t("emailInvalid") }),

    password: z
      .string()
      .trim()
      .min(1, { message: t("passwordRequired") })
      .regex(/^\S+$/, { message: t("passwordNoSpaces") })
      .min(8, { message: t("passwordTooShort") }),
  });

export type LoginSchema = z.infer<ReturnType<typeof createLoginSchema>>;

export const initialFormValues = {
  email: "",
  password: "",
} as LoginSchema;
