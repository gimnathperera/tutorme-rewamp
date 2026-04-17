import { z } from "zod";

export const paperSearchSchema = z
  .object({
    grade: z.string(),
    subject: z.string(),
    medium: z.string(),
    search: z.string(),
  })
  .superRefine(({ grade, subject, medium }, context) => {
    const hasAnyFilter = Boolean(grade || subject || medium);

    if (!hasAnyFilter) return;

    if (!grade) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Grade is required",
        path: ["grade"],
      });
    }

    if (!subject) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Subject is required",
        path: ["subject"],
      });
    }

    if (!medium) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Medium is required",
        path: ["medium"],
      });
    }
  });

export type PaperSearchSchema = z.infer<typeof paperSearchSchema>;

export const initialFormValues: PaperSearchSchema = {
  grade: "",
  subject: "",
  medium: "",
  search: "",
};
