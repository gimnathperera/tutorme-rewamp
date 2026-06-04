import { z } from "zod";
import { normalizeTextSpaces } from "@/utils/form-normalizers";

const requiredTeachingField = (requiredMsg: string, maxMsg: string) =>
  z.preprocess(
    normalizeTextSpaces,
    z.string().min(1, requiredMsg).max(500, maxMsg),
  );

export const createTeachingProfileSchema = (t: (_key: string) => string) =>
  z.object({
    teachingSummary: requiredTeachingField(
      t("teachingSummaryRequired"),
      t("teachingSummaryMax"),
    ),
    academicDetails: requiredTeachingField(
      t("academicDetailsRequired"),
      t("academicDetailsMax"),
    ),
    studentResults: requiredTeachingField(
      t("studentResultsRequired"),
      t("studentResultsMax"),
    ),
    sellingPoints: requiredTeachingField(
      t("sellingPointsRequired"),
      t("sellingPointsMax"),
    ),
  });

export const initialTeachingProfileFormValues = {
  teachingSummary: "",
  academicDetails: "",
  studentResults: "",
  sellingPoints: "",
};

export type TeachingProfileSchema = z.infer<
  ReturnType<typeof createTeachingProfileSchema>
>;
