import { z } from "zod";
import { normalizeTextSpaces } from "@/utils/form-normalizers";

const requiredTeachingField = (label: string) =>
  z.preprocess(
    normalizeTextSpaces,
    z
      .string()
      .min(1, `${label} is required`)
      .max(500, `${label} cannot exceed 500 characters`),
  );

export const teachingProfileSchema = z.object({
  teachingSummary: requiredTeachingField("Short Introduction"),
  academicDetails: requiredTeachingField(
    "Summary of Teaching Experience & Academic Achievements",
  ),
  studentResults: requiredTeachingField("Student Results"),
  sellingPoints: requiredTeachingField("Selling Points"),
});

export const initialTeachingProfileFormValues = {
  teachingSummary: "",
  academicDetails: "",
  studentResults: "",
  sellingPoints: "",
};

export type TeachingProfileSchema = z.infer<typeof teachingProfileSchema>;
