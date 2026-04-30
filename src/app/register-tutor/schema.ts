import {
  PASSWORD_LETTER_NUMBER_MSG,
  PASSWORD_LETTER_NUMBER_REGEX,
  PASSWORD_MAX,
  PASSWORD_MIN,
  PASSWORD_TOO_LONG,
  PASSWORD_TOO_SHORT,
} from "@/configs/password";
import { isPhysicalClassType } from "@/configs/register-tutor";
import {
  normalizeTextSpaces,
  removeWhitespace,
  trimText,
} from "@/utils/form-normalizers";
import { z } from "zod";

/** Plain ZodObject used for .merge() in fullSchema */
const step1BaseSchema = z.object({
  fullName: z.preprocess(
    normalizeTextSpaces,
    z
      .string()
      .min(1, "Full Name is required")
      .regex(/^[A-Za-z\s]+$/, "Full Name can contain letters and spaces only"),
  ),

  email: z.preprocess(
    removeWhitespace,
    z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
  ),

  password: z.preprocess(
    removeWhitespace,
    z
      .string()
      .nonempty("Password is required.")
      .min(PASSWORD_MIN, { message: PASSWORD_TOO_SHORT })
      .max(PASSWORD_MAX, { message: PASSWORD_TOO_LONG })
      .regex(PASSWORD_LETTER_NUMBER_REGEX, {
        message: PASSWORD_LETTER_NUMBER_MSG,
      }),
  ),

  confirmPassword: z.preprocess(
    removeWhitespace,
    z.string().nonempty("Confirm Password is required."),
  ),

  contactNumber: z.preprocess(
    removeWhitespace,
    z
      .string()
      .min(1, "Contact Number is required")
      .regex(/^\d+$/, "Contact Number must contain numeric values only")
      .length(10, "Contact Number should be exactly 10 digits"),
  ),

  dateOfBirth: z.preprocess(
    trimText,
    z.string().min(1, "Date of Birth is required"),
  ),

  gender: z.string().refine((v) => ["Male", "Female", "Others"].includes(v), {
    message: "Gender is required",
  }),

  age: z
    .number()
    .int()
    .min(18, "You must be at least 18 years old")
    .max(80, "Age must be below 80"),

  nationality: z.string().refine((v) => ["Sri Lankan", "Others"].includes(v), {
    message: "Nationality is required",
  }),

  race: z
    .string()
    .refine(
      (v) => ["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"].includes(v),
      {
        message: "Race is required",
      },
    ),
});

/** Cross-field refinement shared between step1Schema and fullSchema */
const passwordMatchRefinement = (
  password: string,
  confirmPassword: string,
  ctx: z.RefinementCtx,
) => {
  if (confirmPassword && password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
};

/** Step-1 schema with password-match refinement (ZodEffects — cannot .merge) */
export const step1Schema = step1BaseSchema.superRefine(
  ({ password, confirmPassword }, ctx) =>
    passwordMatchRefinement(password, confirmPassword, ctx),
);

export const step2Schema = z.object({
  classType: z
    .array(
      z
        .string()
        .refine(
          (v) =>
            [
              "Online - Individual",
              "Online - Group",
              "Physical - Individual",
              "Physical - Group",
            ].includes(v),
          { message: "Invalid class type selected" },
        ),
    )
    .min(1, "Class Type is required"),

  preferredLocations: z.array(z.string()),

  tutorType: z.array(z.string()).min(1, "Tutor Types are required"),

  tutorMediums: z
    .array(
      z.string().refine((v) => ["Sinhala", "English", "Tamil"].includes(v), {
        message: "Invalid medium selected",
      }),
    )
    .min(1, "Tutor Mediums are required"),

  highestEducation: z
    .string()
    .refine(
      (v) =>
        [
          "PhD",
          "Masters",
          "Bachelor Degree",
          "Undergraduate",
          "Diploma and Professional",
          "AL",
        ].includes(v),
      {
        message: "Highest Education is required",
      },
    ),

  grades: z.array(z.string()).min(1, "Grades are required"),

  subjects: z.array(z.string()).min(1, "Subjects are required"),

  yearsExperience: z
    .number()
    .min(1, "Years of Experience is required")
    .max(50, "Experience cannot exceed 50 years"),
});

export const step3Schema = z.object({
  teachingSummary: z.preprocess(
    normalizeTextSpaces,
    z
      .string()
      .min(1, "Teaching Summary is required")
      .max(500, "Teaching Summary cannot exceed 500 characters"),
  ),

  studentResults: z.preprocess(
    normalizeTextSpaces,
    z
      .string()
      .min(1, "Student Results is required")
      .max(500, "Student Results cannot exceed 500 characters"),
  ),

  sellingPoints: z.preprocess(
    normalizeTextSpaces,
    z
      .string()
      .min(1, "Selling Points is required")
      .max(500, "Selling Points cannot exceed 500 characters"),
  ),

  academicDetails: z.preprocess(
    normalizeTextSpaces,
    z
      .string()
      .min(1, "Academic Details is required")
      .max(500, "Academic Details cannot exceed 500 characters"),
  ),
});

export const step4Schema = z.object({
  certificatesAndQualifications: z
    .array(
      z.object({
        type: z.string().min(1, "Document type is required"),
        url: z.string().min(1, "Please upload a file"),
      }),
    )
    .min(1, "At least one document is required"),
  agreeTerms: z.boolean().refine((v) => v, "You must agree to Terms"),
  agreeAssignmentInfo: z
    .boolean()
    .refine((v) => v, "You must confirm assignment info"),
});

export const fullSchema = step1BaseSchema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .superRefine(
    ({ password, confirmPassword, classType, preferredLocations }, ctx) => {
      passwordMatchRefinement(password, confirmPassword, ctx);

      if (
        classType.some(isPhysicalClassType) &&
        preferredLocations.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Preferred Locations are required",
          path: ["preferredLocations"],
        });
      }
    },
  );

export type FindMyTutorForm = z.infer<typeof fullSchema>;
