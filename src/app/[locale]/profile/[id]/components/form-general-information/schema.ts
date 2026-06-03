import { z } from "zod";
import {
  normalizeTextSpaces,
  removeWhitespace,
} from "@/utils/form-normalizers";

const parseBirthday = (birthday: string | Date) => {
  if (birthday instanceof Date) {
    return Number.isNaN(birthday.getTime()) ? undefined : birthday;
  }

  const dateOnlyMatch = birthday.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  }

  const parsedDate = new Date(birthday);
  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

const calculateAge = (birthday: string | Date) => {
  const dob = parseBirthday(birthday);

  if (!dob) return undefined;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

export const createGeneralInfoSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.preprocess(
        normalizeTextSpaces,
        z
          .string()
          .min(1, t("nameRequired"))
          .regex(/^[\p{L}\p{M}\s]+$/u, t("nameLettersOnly")),
      ),
      email: z.preprocess(
        removeWhitespace,
        z.string().email(t("emailInvalid")),
      ),
      phoneNumber: z.preprocess(
        removeWhitespace,
        z
          .string()
          .min(1, t("contactRequired"))
          .regex(/^\d+$/, t("contactNumeric"))
          .length(10, t("contactLength")),
      ),
      birthday: z
        .union([z.string(), z.date()])
        .refine((val) => val !== "" && val !== null && val !== undefined, {
          message: t("dateOfBirthRequired"),
        })
        .transform((value) => (value === "" ? undefined : value))
        .refine(
          (date) => {
            if (!date) return true;
            const dob = parseBirthday(date);
            if (!dob) return false;

            const today = new Date();
            const todayStart = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
            );

            return dob < todayStart;
          },
          { message: t("birthdayFuture") },
        )
        .refine(
          (date) => {
            if (!date) return true;
            const derivedAge = calculateAge(date);
            return typeof derivedAge === "number" && derivedAge >= 18;
          },
          { message: t("ageMinimum") },
        ),
      age: z.preprocess(
        (value) => {
          if (value === "" || value === null || value === undefined) {
            return undefined;
          }
          return Number(value);
        },
        z
          .number({
            invalid_type_error: t("ageRequired"),
            required_error: t("ageRequired"),
          })
          .int()
          .min(18, t("ageMinimum"))
          .max(80, t("ageMaximum")),
      ),
      gender: z
        .string()
        .refine((v) => ["Male", "Female", "Others"].includes(v), {
          message: t("genderRequired"),
        }),
      nationality: z
        .string()
        .refine((v) => ["Sri Lankan", "Others"].includes(v), {
          message: t("nationalityRequired"),
        }),
      race: z
        .string()
        .refine(
          (v) =>
            ["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"].includes(v),
          { message: t("raceRequired") },
        ),
    })
    .superRefine((data, context) => {
      const derivedAge = data.birthday
        ? calculateAge(data.birthday)
        : undefined;

      if (typeof derivedAge === "number" && derivedAge !== data.age) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("ageMismatch"),
          path: ["age"],
        });
      }
    });

export const initialGeneralInfoFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  birthday: "" as any,
  age: "" as unknown as number,
  gender: "",
  nationality: "",
  race: "",
};

export type GeneralInfoSchema = z.infer<
  ReturnType<typeof createGeneralInfoSchema>
>;
