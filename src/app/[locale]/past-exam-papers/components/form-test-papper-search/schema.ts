import { z } from "zod";

export const paperSearchSchema = z.object({
  grade: z.string(),
  subject: z.string(),
  medium: z.string(),
  fromYear: z.string(),
  toYear: z.string(),
  exam: z.string(),
});

export type PaperSearchSchema = z.infer<typeof paperSearchSchema>;

export const initialFormValues: PaperSearchSchema = {
  grade: "",
  subject: "",
  medium: "",
  fromYear: "",
  toYear: "",
  exam: "",
};
