import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().nonempty("Full Name is required"),

    email: z
      .string()
      .nonempty("Email is required.")
      .email({ message: "Invalid email address" }),

    password: z
      .string()
      .nonempty("Password is required.")
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(12, { message: "Password cannot exceed 12 characters" })
      .superRefine((val, ctx) => {
        const hasLetter = /[a-zA-Z]/.test(val);
        const hasNumber = /\d/.test(val);
        if (!hasLetter || !hasNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "password must contain at least 1 letter and 1 number",
          });
        }
      }),

    confirmPassword: z.string().nonempty("Please confirm your password."),
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
