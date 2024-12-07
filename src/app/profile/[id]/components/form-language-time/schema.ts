import { z } from "zod";

export const languageOptionsSchema = z.object({
  timeZone: z.string().min(1, "TimeZone is required"),
  language: z.string().min(1, "Language is required"),
});

export const initialFormValues = {
  timeZone: "",
  language: "",
};

export type LanguageOptionsSchema = z.infer<typeof languageOptionsSchema>;
