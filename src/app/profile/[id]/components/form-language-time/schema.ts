import { z } from "zod";
import { normalizeAvailabilityValue } from "./availability";

const optionalProfileField = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.string().optional(),
);

export const languageOptionsSchema = z.object({
  timeZone: optionalProfileField,
  language: optionalProfileField,
  availability: z.preprocess(normalizeAvailabilityValue, z.string().optional()),
  rate: optionalProfileField,
});

export const initialLanguageAndTimeFormValues = {
  timeZone: "",
  language: "",
  availability: "",
  rate: "",
};

export type LanguageOptionsSchema = z.infer<typeof languageOptionsSchema>;
