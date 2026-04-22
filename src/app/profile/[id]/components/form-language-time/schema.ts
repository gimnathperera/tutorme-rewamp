import { z } from "zod";

const optionalProfileField = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.string().optional(),
);

export const languageOptionsSchema = z.object({
  timeZone: optionalProfileField,
  language: optionalProfileField,
  availability: optionalProfileField,
  rate: optionalProfileField,
});

export const initialLanguageAndTimeFormValues = {
  timeZone: "",
  language: "",
  availability: "",
  rate: "",
};

export type LanguageOptionsSchema = z.infer<typeof languageOptionsSchema>;
