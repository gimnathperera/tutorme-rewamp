import { z } from "zod";
import { isPhysicalClassType } from "@/configs/register-tutor";

const requiredMultiSelect = (message: string) =>
  z.array(z.string()).min(1, message);

export const educationInfoSchema = z
  .object({
    classType: requiredMultiSelect("Class Type is required"),
    preferredLocations: z.array(z.string()),
    tutorTypes: requiredMultiSelect("Tutor Types are required"),
    highestEducation: z.string().min(1, "Highest Education Level is required"),
    yearsExperience: z.preprocess(
      (value) => {
        if (value === "" || value === null || value === undefined) {
          return undefined;
        }

        return Number(value);
      },
      z
        .number({
          invalid_type_error: "Years of Experience is required",
          required_error: "Years of Experience is required",
        })
        .min(0, "Years of Experience cannot be negative")
        .max(50, "Experience cannot exceed 50 years"),
    ),
    tutorMediums: requiredMultiSelect("Tutor Mediums are required"),
    grades: requiredMultiSelect("Grades are required"),
    subjects: requiredMultiSelect("Subjects are required"),
    certificatesAndQualifications: z
      .array(z.string())
      .min(1, "Certificates are required"),
  })
  .superRefine(({ classType, preferredLocations }, ctx) => {
    if (classType.some(isPhysicalClassType) && preferredLocations.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Preferred Locations are required",
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
  certificatesAndQualifications: [] as string[],
};

export type EducationInfoSchema = z.infer<typeof educationInfoSchema>;
