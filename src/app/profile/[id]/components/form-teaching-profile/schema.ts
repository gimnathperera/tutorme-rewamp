import { z } from "zod";
import { normalizeTextSpaces } from "@/utils/form-normalizers";

const optionalTeachingField = (label: string) =>
  z.preprocess(
    normalizeTextSpaces,
    z.string().max(500, `${label} cannot exceed 500 characters`).optional(),
  );

export const teachingProfileSchema = z.object({
  teachingSummary: optionalTeachingField("Short Introduction"),
  studentResults: optionalTeachingField("Student Results"),
  sellingPoints: optionalTeachingField("Selling Points"),
});

export const initialTeachingProfileFormValues = {
  teachingSummary: "",
  studentResults: "",
  sellingPoints: "",
};

export type TeachingProfileSchema = z.infer<typeof teachingProfileSchema>;
