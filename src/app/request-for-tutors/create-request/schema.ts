import { z } from "zod";

export const createRequestTutorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  region: z.string().min(1, "Region is required"),
  zip: z.string().min(1, "ZIP code is required"),
  grade: z.array(z.string()).min(1, "Please select at least one grade"),
  tutors: z.array(
    z.object({
      duration: z.string().nonempty("Please select a duration"),
      frequency: z.string().nonempty("Please select a frequency"),
      subjects: z
        .array(z.string())
        .min(1, "Please select at least one subject"),
    })
  ),
  preferredTutorType: z.string().nonempty("Please select a tutor type"),
  studentSchool: z.string().min(1),
  genderPreference: z.string().nonempty("Please select a gender preference"),
  bilingual: z.string().nonempty("Please select an option"),
});

export type CreateRequestTutorSchema = z.infer<typeof createRequestTutorSchema>;

export const initialFormValues: CreateRequestTutorSchema = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  city: "",
  state: "",
  region: "",
  zip: "",
  grade: [],
  tutors: [
    {
      subjects: [],
      duration: "",
      frequency: "",
    },
  ],
  preferredTutorType: "",
  studentSchool: "",
  genderPreference: "",
  bilingual: "",
};
