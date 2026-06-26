"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import WhatsAppButton from "@/components/shared/whatapp-button";
import ZoomableImage from "@/components/shared/zoomable-image";

const RegisterTutorGuidePage = () => {
  const t = useTranslations("registerTutorGuide");
  const locale = useLocale();
  const img = (base: string) =>
    locale === "en" ? base : base.replace(".png", `-${locale}.png`);

  const steps = useMemo(
    () => [
      {
        number: 1,
        title: t("step1Title"),
        image: img("/images/guides/register-tutor/step-1-personal-info.png"),
        fields: [
          { label: t("step1FullNameLabel"), description: t("step1FullNameDesc") },
          { label: t("step1EmailLabel"), description: t("step1EmailDesc") },
          { label: t("step1PasswordLabel"), description: t("step1PasswordDesc") },
          { label: t("step1ConfirmPasswordLabel"), description: t("step1ConfirmPasswordDesc") },
          { label: t("step1ContactNumberLabel"), description: t("step1ContactNumberDesc") },
          { label: t("step1GenderLabel"), description: t("step1GenderDesc") },
          { label: t("step1DateOfBirthLabel"), description: t("step1DateOfBirthDesc") },
          { label: t("step1AgeLabel"), description: t("step1AgeDesc") },
          { label: t("step1ReferralCodeLabel"), description: t("step1ReferralCodeDesc") },
        ],
        note: null,
      },
      {
        number: 2,
        title: t("step2Title"),
        image: img("/images/guides/register-tutor/step-2-qualifications.png"),
        fields: [
          { label: t("step2ClassTypeLabel"), description: t("step2ClassTypeDesc") },
          { label: t("step2PreferredLocationsLabel"), description: t("step2PreferredLocationsDesc") },
          { label: t("step2TutorTypesLabel"), description: t("step2TutorTypesDesc") },
          { label: t("step2HighestEducationLabel"), description: t("step2HighestEducationDesc") },
          { label: t("step2YearsExperienceLabel"), description: t("step2YearsExperienceDesc") },
          { label: t("step2TutorMediumsLabel"), description: t("step2TutorMediumsDesc") },
          { label: t("step2GradesLabel"), description: t("step2GradesDesc") },
          { label: t("step2SubjectsLabel"), description: t("step2SubjectsDesc") },
        ],
        note: null,
      },
      {
        number: 3,
        title: t("step3Title"),
        image: img("/images/guides/register-tutor/step-3-verification.png"),
        fields: [
          { label: t("step3EduDetailsLabel"), description: t("step3EduDetailsDesc") },
          { label: t("step3OptionalDetailsLabel"), description: t("step3OptionalDetailsDesc") },
          { label: t("step3AgreeTermsLabel"), description: t("step3AgreeTermsDesc") },
          { label: t("step3AgreeAssignmentLabel"), description: t("step3AgreeAssignmentDesc") },
        ],
        note: t("step3Note"),
      },
    ],
    [t],
  );

  return (
    <div className="px-4 lg:px-8">
      <div className="mx-auto max-w-4xl py-6 sm:py-10">

        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("pageTitle")}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-gray-500">
            {t("pageSubtitle")}
          </p>
        </div>

        {/* Top note */}
        <div className="mb-10 rounded-lg border border-red-300 bg-red-50 px-5 py-4">
          <p className="text-sm text-red-700 font-medium leading-relaxed">
            <span className="font-bold">Note:</span> {t("topNote")}
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
          <h3 className="text-xl font-bold text-white mb-2">{t("ctaTitle")}</h3>
          <p className="text-sm text-blue-100 mb-5">{t("ctaDesc")}</p>
          <Link
            href="/register-tutor"
            className="inline-block rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-primary-600 hover:bg-blue-50 transition-colors"
          >
            {t("ctaButton")}
          </Link>
        </div>

      </div>
      <WhatsAppButton />
    </div>
  );
};

export default RegisterTutorGuidePage;
