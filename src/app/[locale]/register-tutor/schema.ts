import {
  CLASS_TYPE_VALUES,
  GENDER_VALUES,
  isPhysicalClassType,
  MEDIUM_VALUES,
  REGISTER_HIGHEST_EDUCATION_VALUES,
} from "@/configs/register-tutor";
import {
  PASSWORD_LETTER_NUMBER_REGEX,
  PASSWORD_MAX,
  PASSWORD_MIN,
} from "@/configs/password";
import {
  normalizeTextSpaces,
  removeWhitespace,
  trimText,
} from "@/utils/form-normalizers";
import { z } from "zod";

const isConfiguredValue = (values: readonly string[], value: string) =>
  values.includes(value);

const parseDateInput = (value: string) => {
  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const y = Number(year);
    const m = Number(month) - 1;
    const d = Number(day);
    const parsedDate = new Date(y, m, d);

    if (Number.isNaN(parsedDate.getTime())) return undefined;

    if (
      parsedDate.getFullYear() !== y ||
      parsedDate.getMonth() !== m ||
      parsedDate.getDate() !== d
    ) {
      return undefined;
    }

    return parsedDate;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

const getMinimumAdultBirthDate = () => {
  const today = new Date();
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
};

export const STEP2_FIELDS = [
  "classType",
  "preferredLocations",
  "tutorType",
  "tutorMediums",
  "highestEducation",
  "grades",
  "subjects",
  "yearsExperience",
] as const;

const createStep1BaseSchema = (t: (_key: string) => string) =>
  z.object({
    fullName: z.preprocess(
      normalizeTextSpaces,
      z
        .string()
        .min(1, t("nameRequired"))
        .regex(/^[\p{L}\p{M}\s]+$/u, t("nameLettersOnly")),
    ),

    email: z.preprocess(
      removeWhitespace,
      z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    ),

    password: z.preprocess(
      removeWhitespace,
      z
        .string()
        .nonempty(t("passwordRequired"))
        .min(PASSWORD_MIN, { message: t("passwordTooShort") })
        .max(PASSWORD_MAX, { message: t("passwordTooLong") })
        .regex(PASSWORD_LETTER_NUMBER_REGEX, {
          message: t("passwordLetterNumber"),
        }),
    ),

    confirmPassword: z.preprocess(
      removeWhitespace,
      z.string().nonempty(t("confirmPasswordRequired")),
    ),

    contactNumber: z.preprocess(
      removeWhitespace,
      z
        .string()
        .min(1, t("contactRequired"))
        .regex(/^\d+$/, t("contactNumeric"))
        .length(10, t("contactLength")),
    ),

    dateOfBirth: z.preprocess(
      trimText,
      z
        .string()
        .min(1, t("dateRequired"))
        .refine((value) => Boolean(parseDateInput(value)), {
          message: t("dateInvalid"),
        })
        .refine(
          (value) => {
            const dateOfBirth = parseDateInput(value);
            return Boolean(
              dateOfBirth && dateOfBirth <= getMinimumAdultBirthDate(),
            );
          },
          { message: t("ageMinimum") },
        ),
    ),

    gender: z.string().refine((v) => isConfiguredValue(GENDER_VALUES, v), {
      message: t("genderRequired"),
    }),

    age: z.number().int().min(18, t("ageMinimum")).max(80, t("ageMaximum")),

    referredByCode: z.preprocess(
      (v) => (typeof v === "string" ? v.trim().toUpperCase() : v),
      z
        .string()
        .regex(/^[A-Z0-9]*$/, t("referredByCodeFormatError"))
        .max(20)
        .optional()
        .or(z.literal("")),
    ),
  });

const createStep2Schema = (t: (_key: string) => string) =>
  z.object({
    classType: z
      .array(
        z.string().refine((v) => isConfiguredValue(CLASS_TYPE_VALUES, v), {
          message: t("classTypeInvalid"),
        }),
      )
      .min(1, t("classTypeRequired")),

    preferredLocations: z.array(z.string()),

    tutorType: z.array(z.string()).min(1, t("tutorTypesRequired")),

    tutorMediums: z
      .array(
        z.string().refine((v) => isConfiguredValue(MEDIUM_VALUES, v), {
          message: t("mediumInvalid"),
        }),
      )
      .min(1, t("tutorMediumsRequired")),

    highestEducation: z
      .string()
      .refine((v) => isConfiguredValue(REGISTER_HIGHEST_EDUCATION_VALUES, v), {
        message: t("highestEducationRequired"),
      }),

    grades: z.array(z.string()).min(1, t("gradesRequired")),

    subjects: z.array(z.string()).min(1, t("subjectsRequired")),

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
  });

const createStep4Schema = (t: (_key: string) => string) =>
  z.object({
    certificatesAndQualifications: z
      .array(
        z.object({
          type: z.string().min(1, t("documentTypeRequired")),
          url: z.string().min(1, t("uploadRequired")),
        }),
      )
      .min(1, t("documentRequired")),
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
    agreeTerms: z.boolean().refine((v) => v, t("agreeTermsRequired")),
    agreeAssignmentInfo: z
      .boolean()
      .refine((v) => v, t("agreeAssignmentRequired")),
  });

export const createFullSchema = (t: (_key: string) => string) =>
  createStep1BaseSchema(t)
    .merge(createStep2Schema(t))
    .merge(createStep4Schema(t))
    .superRefine(
      ({ password, confirmPassword, classType, preferredLocations }, ctx) => {
        if (confirmPassword && password !== confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("passwordsNoMatch"),
            path: ["confirmPassword"],
          });
        }

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
      },
    );

export type FindMyTutorForm = z.infer<ReturnType<typeof createFullSchema>>;
