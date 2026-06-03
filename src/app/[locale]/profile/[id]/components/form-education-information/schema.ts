import { z } from "zod";
import { isPhysicalClassType } from "@/configs/register-tutor";

const requiredMultiSelect = (message: string) =>
  z.array(z.string()).min(1, message);

export const createEducationInfoSchema = (t: (_key: string) => string) =>
  z
    .object({
      classType: requiredMultiSelect(t("classTypeRequired")),
      preferredLocations: z.array(z.string()),
      tutorTypes: requiredMultiSelect(t("tutorTypesRequired")),
      highestEducation: z.string().min(1, t("highestEducationRequired")),
      yearsExperience: z.preprocess(
        (value) => {
          if (value === "" || value === null || value === undefined) {
            return undefined;
          }
          return Number(value);
        },
        z
          .number({
            invalid_type_error: t("yearsExperienceRequired"),
            required_error: t("yearsExperienceRequired"),
          })
          .min(1, t("yearsExperienceMin"))
          .max(50, t("yearsExperienceMax")),
      ),
      tutorMediums: requiredMultiSelect(t("tutorMediumsRequired")),
      grades: requiredMultiSelect(t("gradesRequired")),
      subjects: requiredMultiSelect(t("subjectsRequired")),
      certificatesAndQualifications: z
        .array(
          z.object({
            type: z.string().min(1, t("documentTypeRequired")),
            url: z.string().min(1, t("uploadRequired")),
          }),
        )
        .min(1, t("certificatesRequired")),
      optionalCertificates: z
        .array(
          z.object({
            type: z.string(),
            url: z.string(),
          }),
        )
        .optional()
        .default([]),
    })
    .superRefine(({ classType, preferredLocations }, ctx) => {
      if (
        classType.some(isPhysicalClassType) &&
        preferredLocations.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("preferredLocationsRequired"),
          path: ["preferredLocations"],
        });
      }
    });

export const initialEducationInfoFormValues = {
  classType: [] as string[],
  preferredLocations: [] as string[],
  tutorTypes: [] as string[],
  highestEducation: "",
  yearsExperience: "" as unknown as number,
  tutorMediums: [] as string[],
  grades: [] as string[],
  subjects: [] as string[],
  certificatesAndQualifications: [] as { type: string; url: string }[],
  optionalCertificates: [] as { type: string; url: string }[],
};

export type EducationInfoSchema = z.infer<
  ReturnType<typeof createEducationInfoSchema>
>;
