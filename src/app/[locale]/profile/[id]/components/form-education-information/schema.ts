import { z } from "zod";
import { isPhysicalClassType } from "@/configs/register-tutor";

const requiredMultiSelect = (message: string) =>
  z.array(z.string()).min(1, message);

/**
 * Subjects validation state for the selected grades:
 * - "required": a grade is selected but no subject is chosen.
 * - "perGrade": at least one selected grade (that offers subjects) has none
 *   of its subjects selected.
 * - "ok": nothing to flag.
 */
export const getSubjectCoverageState = (
  grades: string[],
  subjects: string[],
  subjectsByGrade: Record<string, string[]>,
): "required" | "perGrade" | "ok" => {
  if (grades.length === 0) return "ok";
  if (subjects.length === 0) return "required";

  const selected = new Set(subjects);
  const hasGradeWithoutSubject = grades.some((gradeId) => {
    const gradeSubjects = subjectsByGrade[gradeId] ?? [];
    return (
      gradeSubjects.length > 0 &&
      !gradeSubjects.some((id) => selected.has(id))
    );
  });

  return hasGradeWithoutSubject ? "perGrade" : "ok";
};

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
          z
            .object({
              type: z.string(),
              url: z.string(),
            })
            .superRefine((doc, ctx) => {
              const hasType = !!doc.type.trim();
              const hasUrl = !!doc.url.trim();
              if (!hasType && !hasUrl) return;
              if (hasType && !hasUrl) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("uploadRequired"),
                  path: ["url"],
                });
              }
              if (!hasType && hasUrl) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("documentTypeRequired"),
                  path: ["type"],
                });
              }
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
