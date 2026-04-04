import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z
    .array(
      z.union([
        z.object({
          type: z.literal("paragraph"),
          text: z.string().optional().default(""),
        }),
        z.object({
          type: z.literal("heading"),
          text: z.string().optional().default(""),
          level: z.number().int().min(1).max(6),
        }),
        z.object({
          type: z.literal("image"),
          src: z.string().optional().default(""),
          caption: z.string().optional(),
        }),
        z.object({
          type: z.literal("table"),
          headers: z.array(z.string()).optional().default([]),
          rows: z.array(z.array(z.string())).optional().default([]),
        }),
        z.object({
          type: z.literal("quote"),
          text: z.string().min(1, "Quote text is required"),
          citation: z.string().optional(),
        }),
        z.object({
          type: z.literal("list"),
          items: z.array(z.string()).min(1, "List must have at least one item"),
          style: z
            .enum(["ordered", "unordered"])
            .optional()
            .default("unordered"),
        }),
        z.object({
          type: z.literal("embed"),
          src: z.string().optional(),
          html: z.string().optional(),
        }),
      ]),
    )
    .optional()
    .default([]),
  image: z.string().optional().default(""),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, "FAQ question is required"),
        answer: z.string().min(1, "FAQ answer is required"),
      }),
    )
    .optional(),
  tags: z.array(z.string().min(1, "Please add a tag")).optional(),
  relatedArticles: z
    .array(z.string().min(1, "Related article ID is required"))
    .optional(),
  status: z.enum(["pending", "published", "draft"]),
});

export type CreateArticleSchema = z.infer<typeof createArticleSchema>;

export const initialFormValues: CreateArticleSchema = {
  title: "",
  content: [{ type: "paragraph", text: "" }],
  image: "",
  relatedArticles: [],
  tags: [],
  faqs: [],
  status: "pending",
};
