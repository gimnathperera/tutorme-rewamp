import { removeWhitespace } from "@/utils/form-normalizers";
import { z } from "zod";

export const createContactUsSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t("nameRequired"))
      .regex(/^[A-Za-z\s]+$/, t("nameLettersOnly"))
      .refine((v) => !/ {2,}/.test(v), t("nameNoMultipleSpaces")),

    email: z
      .string()
      .trim()
      .min(1, t("emailRequired"))
      .email(t("emailInvalid")),

    contactNumber: z.preprocess(
      removeWhitespace,
      z
        .string()
        .min(1, t("contactRequired"))
        .regex(/^\d+$/, t("contactNumeric"))
        .length(10, t("contactLength")),
    ),

    message: z.string().trim().min(1, t("messageRequired")),
  });

export const initialFormValues = {
  name: "",
  email: "",
  contactNumber: "",
  message: "",
};

export type ContactUsPageSchema = z.infer<
  ReturnType<typeof createContactUsSchema>
>;
