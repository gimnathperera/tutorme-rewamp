import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.object({
    name: z.string().min(1, "Author name is required"),
    avatar: z.string().url("Avatar must be a valid URL"),
    role: z.string().min(1, "Author role is required"),
  }),
  content: z
    .array(
      z.union([
        z.object({
          type: z.literal("paragraph"),
          text: z.string().min(1, "Paragraph text is required"),
        }),
        z.object({
          type: z.literal("heading"),
          text: z.string().min(1, "Heading text is required"),
          level: z.number().int().min(1).max(6),
        }),
        z.object({
          type: z.literal("image"),
          src: z.string().url("Image source must be a valid URL"),
          caption: z.string().optional(),
        }),
      ])
    )
    .nonempty("Content cannot be empty"),
  relatedArticles: z
    .array(z.string().min(1, "Subject ID is required"))
    .nonempty("At least one subject is required"),
  status: z.enum(["pending", "published", "draft"]),
});

export type CreateArticleSchema = z.infer<typeof createArticleSchema>;

// Default form values
export const initialFormValues: CreateArticleSchema = {
  title: "",
  author: {
    name: "",
    avatar: "",
    role: "",
  },
  content: [
    { type: "paragraph", text: "" },
    { type: "heading", text: "", level: 2 },
    { type: "image", src: "", caption: "" },
  ],
  relatedArticles: [""],
  status: "pending",
};
