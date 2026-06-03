import { z } from "zod";
import {
  normalizeTextSpaces,
  removeWhitespace,
  trimText,
} from "@/utils/form-normalizers";

export const createRequestTutorSchema = (t: (key: string) => string) =>
  z.object({
    name: z.preprocess(
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

    city: z.preprocess(trimText, z.string().min(1, t("cityRequired"))),

    district: z.preprocess(trimText, z.string().min(1, t("districtRequired"))),

    phoneNumber: z.preprocess(
      removeWhitespace,
      z
        .string()
        .min(1, t("contactRequired"))
        .regex(/^\d+$/, t("contactNumeric"))
        .length(10, t("contactLength")),
    ),

    medium: z.string().nonempty(t("mediumRequired")),

    grade: z.string().nonempty(t("gradeRequired")),

    tutors: z
      .array(
        z.object({
          subject: z.string().nonempty(t("subjectRequired")),
          assignedTutor: z.string().optional().default(""),
          duration: z.string().nonempty(t("durationRequired")),
          frequency: z.string().nonempty(t("frequencyRequired")),
          preferredTutorType: z.string().nonempty(t("tutorTypeRequired")),
          preferredClassType: z.string().nonempty(t("classTypeRequired")),
        }),
      )
      .min(1, t("tutorCountRequired")),
  });

export type CreateRequestTutorSchema = z.infer<
  ReturnType<typeof createRequestTutorSchema>
>;

export const initialFormValues: CreateRequestTutorSchema = {
  name: "",
  email: "",
  phoneNumber: "",
  city: "",
  district: "",
  medium: "",
  grade: "",
  tutors: [
    {
      subject: "",
      assignedTutor: "",
      duration: "",
      frequency: "",
      preferredTutorType: "",
      preferredClassType: "",
    },
  ],
};
