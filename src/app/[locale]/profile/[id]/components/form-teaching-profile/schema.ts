import { z } from "zod";
import { normalizeTextSpaces } from "@/utils/form-normalizers";

const optionalTeachingField = (maxMsg: string) =>
  z.preprocess(normalizeTextSpaces, z.string().max(500, maxMsg).optional());

export const createTeachingProfileSchema = (t: (_key: string) => string) =>
  z.object({
    teachingSummary: optionalTeachingField(t("teachingSummaryMax")),
    academicDetails: optionalTeachingField(t("academicDetailsMax")),
    studentResults: optionalTeachingField(t("studentResultsMax")),
    sellingPoints: optionalTeachingField(t("sellingPointsMax")),
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
