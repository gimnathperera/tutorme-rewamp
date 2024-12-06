import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, {
      message: "Confirm Password must be at least 6 characters long",
    }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const initialFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
