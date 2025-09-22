import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.object({
    name: z.string().min(1, "Author name is required"),
    avatar: z.string().min(1, "Avatar is required"),
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
          src: z.string().min(1, "Image source is required"),
          caption: z.string().optional(),
        }),
      ])
    )
    .nonempty("Content cannot be empty"),
  relatedArticles: z
    .array(z.string().min(1, "Related article ID is required"))
    .nonempty("At least one related article is required"),
  status: z.enum(["pending", "published", "draft"]),
});

export type CreateArticleSchema = z.infer<typeof createArticleSchema>;

// Default form values
export const initialFormValues: CreateArticleSchema = {
  title: "",
  author: {
    name: "",
    avatar:
      "https://img.freepik.com/free-photo/woman-beach-with-her-baby-enjoying-sunset_52683-144131.jpg?size=626&ext=jpg",
    role: "Author",
  },
  content: [
    { type: "paragraph", text: "" },
    { type: "heading", text: "", level: 2 },
    { type: "image", src: "", caption: "" },
  ],
  relatedArticles: [""],
  status: "pending",
};
