"use client";

import Link from "next/link";
import WhatsAppButton from "@/components/shared/whatapp-button";
import ZoomableImage from "@/components/shared/zoomable-image";

const steps = [
  {
    number: 1,
    title: "Personal Information",
    image: "/images/guides/register-tutor/step-1-personal-info.png",
    fields: [
      {
        label: "Full Name",
        description:
          "Must include at least two parts of your name (e.g., first name and surname). Only letters and spaces are allowed.",
      },
      {
        label: "Password",
        description:
          "Must be 8–12 characters long and contain both letters and numbers.",
      },
      {
        label: "Email and Confirm Password",
        description:
          "Enter a valid, available email address. Re-enter your password exactly to confirm it.",
      },
      {
        label: "Contact Number",
        description: "Must be a valid number containing exactly 10 digits.",
      },
      {
        label: "Gender",
        description: "Select one of the available options.",
      },
      {
        label: "Date of Birth",
        description:
          "You must be at least 18 years old — dates that would make you younger than 18 cannot be selected.",
      },
      {
        label: "Age",
        description:
          "Automatically calculated based on the Date of Birth you select. This field cannot be edited directly.",
      },
      {
        label: "Nationality and Race",
        description: "Choose the appropriate option from the provided list.",
      },
    ],
    note: null,
  },
  {
    number: 2,
    title: "Qualifications",
    image: "/images/guides/register-tutor/step-2-qualifications.png",
    fields: [
      {
        label: "Class Type",
        description:
          "A multi-select field. You can select all the class types that apply to you.",
      },
      {
        label: "Tutor Types",
        description:
          "A multi-select field. You can select all the tutor types that suit you.",
      },
      {
        label: "Years of Experience",
        description: "Enter the number of years you have spent teaching.",
      },
      {
        label: "Grades",
        description:
          "A multi-select field. You can select all the grades you're interested in teaching.",
      },
      {
        label: "Preferred Locations",
        description:
          "A multi-select field. You can search for and select any number of cities. This field is only enabled when the Class Type is set to \"Physical.\"",
      },
      {
        label: "Highest Education Level",
        description:
          "Your most advanced level of education. You'll need to provide supporting documents to verify this status in a later step.",
      },
      {
        label: "Tutor Mediums",
        description:
          "A multi-select field. You can select all the mediums you're able to teach in.",
      },
      {
        label: "Subjects",
        description:
          "A multi-select field. You can select all the subjects you're interested in teaching for the grades you've selected.",
      },
    ],
    note: null,
  },
  {
    number: 3,
    title: "Teaching Profile",
    image: "/images/guides/register-tutor/step-3-teaching-profile.png",
    fields: [
      {
        label: "Short Introduction About Yourself",
        description:
          "Describe your personal qualities, teaching style, and methodology.",
      },
      {
        label: "Summary of Teaching Experience & Academic Achievements",
        description:
          "Describe your achievements and the subjects you've taught — for example, number of students, years of experience, and results.",
      },
      {
        label: "Results of Students / Track Record",
        description:
          "Describe your past students' results, grade improvements, and examination outcomes.",
      },
      {
        label: "Other Selling Points as a Tutor",
        description:
          "Mention your teaching methods, level of commitment, and what makes you stand out as a tutor.",
      },
    ],
    note: "If you have nothing to mention for a field, please leave it with a \"-\" mark rather than leaving it blank.",
  },
  {
    number: 4,
    title: "Verification & Agreement",
    image: "/images/guides/register-tutor/step-4-verification.png",
    fields: [
      {
        label: "Educational Details (Mandatory)",
        description:
          "Upload at least one document to verify your profile. First select the Document Type, then upload the matching original document. AI-generated or edited certificates are not accepted. Accepted formats: JPG, PNG, PDF. Click \"+ Add Document\" to add more.",
      },
      {
        label: "Optional Details",
        description:
          "Not mandatory. You may upload any additional documents that support your tutor profile. Providing details here can directly affect the outcome of your profile's verification process.",
      },
      {
        label: "I agree to the Terms and Conditions",
        description:
          "By checking this box, you agree to receive assignment information via SMS and understand that rates are subject to negotiation. Admin fees apply for successful assignments.",
      },
      {
        label: "I agree to receive assignment information regarding new Tuition Assignments",
        description:
          "By checking this box, you agree to receive SMS and email notifications about new tutoring assignments that match your preferences.",
      },
    ],
    note: "The Document Type and Uploaded File must match.",
  },
];

const RegisterTutorGuidePage = () => {
  return (
    <div className="px-4 lg:px-8">
      <div className="mx-auto max-w-4xl py-6 sm:py-10">

        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Register as a Tutor — User Guide
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-gray-500">
            Follow the steps below to complete your tutor registration on TuitionLanka.
          </p>
        </div>

        {/* Top note */}
        <div className="mb-10 rounded-lg border border-red-300 bg-red-50 px-5 py-4">
          <p className="text-sm text-red-700 font-medium leading-relaxed">
            <span className="font-bold">Note:</span> The field requiring extra
            attention is marked in each step&apos;s screenshot below. Every field in
            each step is required — none should be left empty.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-14">
          {steps.map((step) => (
            <div key={step.number} className="rounded-xl border border-gray-200 overflow-hidden">

              {/* Step header */}
              <div className="flex items-center gap-3 bg-primary-600 px-6 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-primary-600">
                  {step.number}
                </span>
                <h2 className="text-lg font-semibold text-white">
                  Step {step.number}: {step.title}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Step note */}
                {step.note && (
                  <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">{step.note}</p>
                  </div>
                )}

                {/* Screenshot */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-visible">
                  <ZoomableImage
                    src={step.image}
                    alt={`Step ${step.number}: ${step.title}`}
                    width={800}
                    height={500}
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Field descriptions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Field Descriptions
                  </h3>
                  <ul className="space-y-3">
                    {step.fields.map((field) => (
                      <li key={field.label} className="flex gap-2 text-sm text-gray-700">
                        <span className="mt-1 shrink-0 h-2 w-2 rounded-full bg-primary-600" />
                        <span>
                          <span className="font-semibold">{field.label}:</span>{" "}
                          {field.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 sm:mt-12 rounded-xl bg-primary-600 px-6 py-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Ready to get started?
          </h3>
          <p className="text-sm text-blue-100 mb-5">
            Create your tutor profile and connect with students across Sri Lanka.
          </p>
          <Link
            href="/register-tutor"
            className="inline-block rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-primary-600 hover:bg-blue-50 transition-colors"
          >
            Register as a Tutor
          </Link>
        </div>

      </div>
      <WhatsAppButton />
    </div>
  );
};

export default RegisterTutorGuidePage;
