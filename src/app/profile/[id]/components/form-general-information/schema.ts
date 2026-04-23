import { z } from "zod";
import { addYears, isBefore } from "date-fns";

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

const trimOnly = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

const calculateAge = (birthday: string) => {
  const dob = new Date(birthday);

  if (Number.isNaN(dob.getTime())) return undefined;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

export const generalInfoSchema = z.object({
  name: z.preprocess(
    normalizeText,
    z
      .string()
      .min(1, "Full Name is required")
      .regex(/^[A-Za-z\s]+$/, "Full Name can contain letters and spaces only"),
  ),
  email: z.preprocess(trimOnly, z.string().email("Invalid email address")),
  phoneNumber: z.preprocess(
    trimOnly,
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
        return isBefore(new Date(date), new Date());
      },
      {
        message: "Birthday cannot be a future date",
      },
    )
    .refine(
      (date) => {
        if (!date) return true;
        const today = new Date();
        const minDate = addYears(today, -18);
        return isBefore(new Date(date), minDate);
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
  gender: z
    .string()
    .refine((v) => ["Male", "Female", "Others"].includes(v), {
      message: "Gender is required",
    }),
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
}).superRefine((data, context) => {
  const birthday =
    typeof data.birthday === "string"
      ? data.birthday
      : data.birthday instanceof Date
        ? data.birthday.toISOString()
        : "";

  const derivedAge = calculateAge(birthday);

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
