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

export const generalInfoSchema = z
  .object({
    name: z.preprocess(
      normalizeTextSpaces,
      z
        .string()
        .min(1, "Full Name is required")
        .regex(/^[A-Za-z\s]+$/, "Name can contain letters and spaces only"),
    ),
    email: z.preprocess(
      removeWhitespace,
      z.string().email("Invalid email address"),
    ),
    phoneNumber: z.preprocess(
      removeWhitespace,
      z
        .string()
        .min(1, "Contact Number is required")
        .regex(/^\d+$/, "Contact Number must contain numeric values only")
        .length(10, "Contact Number should be exactly 10 digits"),
    ),
    birthday: z
      .union([z.string(), z.date()])
      .refine((val) => val !== "" && val !== null && val !== undefined, {
        message: "Date of Birth is required",
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
        {
          message: "Birthday cannot be a future date",
        },
      )
      .refine(
        (date) => {
          if (!date) return true;
          const derivedAge = calculateAge(date);
          return typeof derivedAge === "number" && derivedAge >= 18;
        },
        {
          message: "You must be at least 18 years old",
        },
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
          invalid_type_error: "Age is required",
          required_error: "Age is required",
        })
        .int()
        .min(18, "You must be at least 18 years old")
        .max(80, "Age must be below 80"),
    ),
    gender: z.string().refine((v) => ["Male", "Female", "Others"].includes(v), {
      message: "Gender is required",
    }),
    nationality: z
      .string()
      .refine((v) => ["Sri Lankan", "Others"].includes(v), {
        message: "Nationality is required",
      }),
    race: z
      .string()
      .refine(
        (v) =>
          ["Sinhalese", "Tamil", "Muslim", "Burgher", "Others"].includes(v),
        {
          message: "Race is required",
        },
      ),
  })
  .superRefine((data, context) => {
    const derivedAge = data.birthday ? calculateAge(data.birthday) : undefined;

    if (typeof derivedAge === "number" && derivedAge !== data.age) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Age does not match the selected date of birth",
        path: ["age"],
      });
    }
  });

export const initialGeneralInfoFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  birthday: "" as any, //TODO: fix the type issue here
  age: "" as unknown as number,
  gender: "",
  nationality: "",
  race: "",
};

export type GeneralInfoSchema = z.infer<typeof generalInfoSchema>;
