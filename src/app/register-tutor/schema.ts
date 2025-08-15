import { z } from "zod";

export const findMyTutorSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  contactNumber: z.string().regex(/^\d{8}$/, "Enter valid 8-digit contact number"),
  confirmContactNumber: z.string(),
  email: z.string().email("Enter valid email"),
  dateOfBirth: z.string().nonempty("Date of birth is required"),
  confirmDateOfBirth: z.string(),
  gender: z.string().nonempty("Gender is required"),
  age: z.number().min(16, "Age must be at least 16").max(80, "Age must be below 80"),
  nationality: z.string().nonempty("Nationality is required"),
  race: z.string().nonempty("Race is required"),
  last4NRIC: z.string().regex(/^\d{4}$/, "Enter exactly 4 digits"),
  tutoringLevels: z.array(z.string()).min(1, "Select at least one level"),
  preferredLocations: z.array(z.string()),
  tutorType: z.string().nonempty("Tutor type is required"),
  yearsExperience: z.number(),
  highestEducation: z.string().nonempty("Highest education is required"),
  academicDetails: z.string().nonempty("Academic details are required"),
  teachingSummary: z.string().nonempty("Teaching summary is required"),
  studentResults: z.string().nonempty("Student results are required"),
  sellingPoints: z.string().nonempty("Selling points are required"),
  agreeTerms: z.boolean().refine((v) => v, "You must agree to Terms & Conditions"),
  agreeAssignmentInfo: z.boolean().refine((v) => v, "You must agree to receive assignment info"),
})
.refine((data) => data.contactNumber === data.confirmContactNumber, {
  message: "Contact numbers do not match",
  path: ["confirmContactNumber"],
})
.refine((data) => data.dateOfBirth === data.confirmDateOfBirth, {
  message: "Dates of birth do not match",
  path: ["confirmDateOfBirth"],
});

export type FindMyTutorForm = z.infer<typeof findMyTutorSchema>;
