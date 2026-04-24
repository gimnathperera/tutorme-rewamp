import { z } from "zod";
import { normalizeTextSpaces } from "@/utils/form-normalizers";

const requiredMultiSelect = (message: string) =>
  z.array(z.string()).min(1, message);

export const educationInfoSchema = z.object({
  tutoringLevels: requiredMultiSelect("Tutoring Levels are required"),
  preferredLocations: requiredMultiSelect("Preferred Locations are required"),
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
  academicDetails: z.preprocess(
    normalizeTextSpaces,
    z
      .string()
      .min(1, "Academic Details are required")
      .max(500, "Academic Details cannot exceed 500 characters"),
  ),
  certificatesAndQualifications: z
    .array(z.string())
    .min(1, "Certificates are required"),
});

export const initialEducationInfoFormValues = {
  tutoringLevels: [] as string[],
  preferredLocations: [] as string[],
  tutorTypes: [] as string[],
  highestEducation: "",
  yearsExperience: "" as unknown as number,
  tutorMediums: [] as string[],
  grades: [] as string[],
  subjects: [] as string[],
  academicDetails: "",
  certificatesAndQualifications: [] as string[],
};

export type EducationInfoSchema = z.infer<typeof educationInfoSchema>;
