import { z } from "zod";

export const paperSearchSchema = z.object({
  grade: z.string().min(1, "Grade is required"),
  subject: z.string().min(1, "Subject is required"),
  medium: z.string(),
  search: z.string(),
});

export type PaperSearchSchema = z.infer<typeof paperSearchSchema>;

export const initialFormValues: PaperSearchSchema = {
  grade: "",
  subject: "",
  medium: "",
  search: "",
};
