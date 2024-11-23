import { z } from "zod";

export const paperSearchSchema = z.object({
  grade: z.string().min(1, "Grade is required"),
  subject: z.string().min(1, "Subject is required"),
});

export type PaperSearchSchema = z.infer<typeof paperSearchSchema>;
