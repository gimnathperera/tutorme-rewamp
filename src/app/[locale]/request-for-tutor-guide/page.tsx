"use client";

import Link from "next/link";
import WhatsAppButton from "@/components/shared/whatapp-button";
import ZoomableImage from "@/components/shared/zoomable-image";

const steps = [
  {
    number: 1,
    title: "Contact Details",
    image: "/images/guides/request-for-tutor/step-1-contact-details.png",
    fields: [
      {
        label: "Full Name",
        description:
          "Must include at least two parts of your name (e.g., first name and surname). Only letters and spaces are allowed.",
      },
      {
        label: "Email",
        description:
          "Enter a valid email address (e.g., johndoe@gmail.com).",
      },
      {
        label: "Contact Number",
        description:
          "Must be a valid number containing exactly 10 digits (e.g., 0712345678).",
      },
      {
        label: "District",
        description:
          "The area where the student or parent is requesting tuition from the tutor.",
      },
      {
        label: "City",
        description:
          "The specific city where the student or parent is requesting tuition. You can only search and select a city after a District has been chosen.",
      },
    ],
    note: null,
  },
  {
    number: 2,
    title: "Tutor Details",
    image: "/images/guides/request-for-tutor/step-2-tutor-details.png.png",
    fields: [
      {
        label: "Medium",
        description:
          "Select the medium of instruction you'd like the tutor to teach in.",
      },
      {
        label: "Grade",
        description:
          "The grade level for which the student or parent is requesting tutors.",
      },
      {
        label: "Number of Tutors",
        description:
          "The number of tutors being requested for the selected grade. Select a tutor count, then fill in the required fields - including Subject - for each individual tutor.",
      },
      {
        label: "Subject",
        description:
          "The subject for which a tutor is being requested, based on the selected grade. A grade must be selected first before choosing a subject.",
      },
      {
        label: "Duration",
        description:
          "Select the preferred length of each tutoring session.",
      },
      {
        label: "Frequency",
        description:
          "Select the preferred number of sessions per week.",
      },
      {
        label: "Preferred Tutor Type",
        description:
          "The type of tutor the student prefers to learn from.",
      },
      {
        label: "Preferred Class Type",
        description:
          "Select the preferred class format (e.g., physical or online).",
      },
    ],
    note: null,
  },
];

const RequestForTutorGuidePage = () => {
  return (
    <div className="px-4 lg:px-8">
      <div className="mx-auto max-w-4xl py-6 sm:py-10">

        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Request for Tutor - User Guide
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-gray-500">
            Follow the steps below to submit your tutor request on TuitionLanka.
          </p>
        </div>

        {/* Top note */}
        <div className="mb-10 rounded-lg border border-red-300 bg-red-50 px-5 py-4">
          <p className="text-sm text-red-700 font-medium leading-relaxed">
            <span className="font-bold">Note:</span> The field requiring extra
            attention is marked in each step&apos;s screenshot below. Every field in
            each step is required - none should be left empty.
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
                <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
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
            Ready to find a tutor?
          </h3>
          <p className="text-sm text-blue-100 mb-5">
            Submit your request and get matched with the right tutor for your needs.
          </p>
          <Link
            href="/request-for-tutors"
            className="inline-block rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-primary-600 hover:bg-blue-50 transition-colors"
          >
            Request for Tutor
          </Link>
        </div>

      </div>
      <WhatsAppButton />
    </div>
  );
};

export default RequestForTutorGuidePage;
