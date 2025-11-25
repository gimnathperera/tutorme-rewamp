import { z } from "zod";

export const contactUsSchema = z.object({
  name: z.string().nonempty("Full Name is required"),

  email: z
    .string()
    .nonempty("Email is required.")
    .email({ message: "Invalid email address" }),
  message: z.string().nonempty("Message is required."),
});

export type ContactUsSchema = z.infer<typeof contactUsSchema>;

export const initialFormValues = {
  name: "",
  email: "",
  message: "",
};
