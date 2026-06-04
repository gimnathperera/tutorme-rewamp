import { z } from "zod";

export const createForgotPasswordSchema = (t: (_key: string) => string) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: t("emailRequired") })
      .email({ message: t("emailInvalid") }),
  });

export type ForgotPasswordSchema = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
