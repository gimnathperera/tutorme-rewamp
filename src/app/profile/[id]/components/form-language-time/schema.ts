import { z } from "zod";

export const languageOptionsSchema = z.object({
  timeZone: z.string().min(1, "TimeZone is required").optional(),
  language: z.string().min(1, "Language is required").optional(),
});

export const initialLanguageAndTimeFormValues = {
  timeZone: "",
  language: "",
};

export type LanguageOptionsSchema = z.infer<typeof languageOptionsSchema>;
