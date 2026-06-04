"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import LegalContactSection from "@/components/shared/legal-contact-section";

// ── Types ─────────────────────────────────────────────────────────────────────

type ContentItem =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "label"; text: string }
  | { kind: "h3"; text: string };

type Section = { title: string; content: ContentItem[] };

// ── Static content data ───────────────────────────────────────────────────────

const HERO_TITLE = "Terms and Conditions";
const HERO_SUBTITLE = "The rules and responsibilities for using TuitionLanka.";
const INTRO_TEXT =
  'These Terms and Conditions govern your access to and use of the TuitionLanka platform, available at www.tuitionlanka.com ("Platform"). TuitionLanka is operated by SOFTVIL TECHNOLOGIES (PVT) LTD (Registration No: PV102511).';

const SECTIONS: Section[] = [
  {
    title: "1. Introduction and Acceptance",
    content: [
      {
        kind: "p",
        text: 'These Terms and Conditions govern your access to and use of the TuitionLanka platform, available at www.tuitionlanka.com ("Platform"). TuitionLanka is operated by SOFTVIL TECHNOLOGIES (PVT) LTD (Registration No: PV102511).',
      },
      {
        kind: "p",
        text: "By registering on, accessing, or using the Platform in any capacity whether as a tutor, a parent, or a visitor you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not use the Platform.",
      },
    ],
  },
  {
    title: "2. Nature of the Platform",
    content: [
      {
        kind: "p",
        text: "TuitionLanka is a tutor matching platform. Our role is limited to:",
      },
      {
        kind: "ul",
        items: [
          "Accepting tutor registrations and verifying their qualifications through a manual review process",
          "Accepting tutor requests from parents and matching them with suitable verified tutors",
          "Facilitating the initial connection between parents and tutors",
        ],
      },
      {
        kind: "p",
        text: "TuitionLanka is not a tutoring agency and does not employ tutors. We do not supervise, direct, or control the tutoring sessions that take place between tutors and students. Once contact details are shared following a confirmed match, TuitionLanka's role in that engagement ends, except as described in these Terms.",
      },
    ],
  },
  {
    title: "3. Eligibility",
    content: [
      {
        kind: "p",
        text: "To use the Platform, you must meet the following requirements:",
      },
      { kind: "label", text: "All Users" },
      {
        kind: "ul",
        items: [
          "You must be at least 18 years of age",
          "You must provide accurate and truthful information when using the Platform",
          "You must not use the Platform for any unlawful or unauthorised purpose",
        ],
      },
      { kind: "label", text: "Tutors" },
      {
        kind: "ul",
        items: [
          "You must be at least 18 years of age",
          "You must hold valid qualifications or credentials relevant to the subjects and grades you wish to teach",
          "You must submit supporting documentation for verification as required by TuitionLanka",
        ],
      },
      { kind: "label", text: "Parents / Guardians" },
      {
        kind: "ul",
        items: [
          "You must be the parent or legal guardian of the student for whom you are requesting a tutor",
          "You must ensure that the information you provide about your tutoring requirements is accurate",
        ],
      },
    ],
  },
  {
    title: "4. Tutor Registration and Verification",
    content: [
      {
        kind: "p",
        text: "Tutors register on the Platform by completing the registration form and submitting supporting verification documents. By registering, tutors agree to the following:",
      },
      {
        kind: "ul",
        items: [
          "All information provided, including personal details, qualifications, experience, fees, and profile content, is accurate, current, and not misleading",
          "Submitted verification documents are genuine and belong to the registering tutor",
          "Tutors will promptly update their profile if any information changes",
        ],
      },
      {
        kind: "p",
        text: "TuitionLanka will review submitted documents manually. A tutor will be designated as a Verified Tutor upon successful completion of this review. TuitionLanka reserves the right to reject any registration, remove verification status, or suspend an account if submitted information is found to be false, misleading, or in violation of these Terms.",
      },
      {
        kind: "p",
        text: "Registration on the Platform is free of charge for tutors.",
      },
    ],
  },
  {
    title: "5. Tutor Profiles and Session Fees",
    content: [
      {
        kind: "p",
        text: "Tutors are responsible for setting and advertising their own per session fees on their profile. By listing a fee on the Platform, tutors confirm that:",
      },
      {
        kind: "ul",
        items: [
          "The fee is accurate and reflects what they charge for a tutoring session",
          "They understand that the first session fee will be collected by TuitionLanka and not paid directly to them, as described in Section 7",
          "From the second session onwards, all fees are settled directly between the tutor and the parent",
        ],
      },
      {
        kind: "p",
        text: "TuitionLanka is not responsible for any disputes arising from fee arrangements made directly between tutors and parents from the second session onwards.",
      },
    ],
  },
  {
    title: "6. Parent Tutor Requests",
    content: [
      {
        kind: "p",
        text: "Parents may submit a tutor request by completing the request form on the Platform. Upon submission, TuitionLanka will review the request and suggest a list of matching verified tutors based on the parent's stated preferences, including subject, grade, medium, location, class type, and fee range.",
      },
      {
        kind: "p",
        text: "The parent will then select one tutor from the suggested options. The match is confirmed upon receipt of the first session payment as described in Section 7.",
      },
    ],
  },
  {
    title: "7. Payment Terms",
    content: [
      { kind: "h3", text: "7.1 First Session Payment" },
      {
        kind: "p",
        text: "Upon selecting a tutor, the parent is required to pay the first session fee of that tutor to TuitionLanka via bank transfer, prior to receiving the tutor's contact details. This payment represents the tutor's advertised per session fee for the first session and is retained by TuitionLanka as our service fee.",
      },
      {
        kind: "p",
        text: "The tutor's contact details will be shared with the parent only after TuitionLanka confirms receipt of the payment.",
      },
      { kind: "h3", text: "7.2 Non Refundable Policy" },
      {
        kind: "p",
        text: "All first session payments made to TuitionLanka are strictly non refundable. By making a payment, parents acknowledge and accept this policy.",
      },
      { kind: "h3", text: "7.3 Tutor Replacement" },
      {
        kind: "p",
        text: "If, after completing the first session, the parent is not satisfied with the assigned tutor, they may request a replacement. In such cases, TuitionLanka will suggest a new set of matching tutors. The parent may then select a new tutor and the full process including a new first session payment will begin from the start.",
      },
      {
        kind: "p",
        text: "No credit, carry forward, or waiver of the first session payment will apply from a previous selection.",
      },
      { kind: "h3", text: "7.4 From the Second Session Onwards" },
      {
        kind: "p",
        text: "TuitionLanka is not involved in any fee arrangements from the second session onwards. All payments, scheduling, and agreements between the tutor and parent from that point are the sole responsibility of the respective parties.",
      },
    ],
  },
  {
    title: "8. Tutor Conduct and Responsibilities",
    content: [
      {
        kind: "p",
        text: "By registering as a tutor on TuitionLanka, you agree to:",
      },
      {
        kind: "ul",
        items: [
          "Attend confirmed sessions punctually and deliver tutoring to a reasonable professional standard",
          "Treat students and parents with respect and professionalism at all times",
          "Not engage in any conduct that is harmful, inappropriate, or unlawful towards students, particularly minors",
          "Not misrepresent your qualifications, experience, or identity to parents or students",
          "Not engage in any activity that brings TuitionLanka into disrepute",
        ],
      },
      {
        kind: "p",
        text: "TuitionLanka reserves the right to suspend or permanently remove any tutor from the Platform who is found to be in breach of these conduct standards, without notice and without refund of any kind.",
      },
    ],
  },
  {
    title: "9. Parent and Student Conduct",
    content: [
      { kind: "p", text: "Parents using the Platform agree to:" },
      {
        kind: "ul",
        items: [
          "Provide accurate information in tutor requests",
          "Treat tutors with respect and professionalism",
          "Not engage in any misleading, abusive, or fraudulent behaviour towards tutors or TuitionLanka",
          "Ensure that the environment in which home tuition sessions take place is safe and appropriate",
        ],
      },
    ],
  },
  {
    title: "10. Limitation of Liability",
    content: [
      {
        kind: "p",
        text: "TuitionLanka acts solely as an intermediary platform. To the fullest extent permitted by applicable law:",
      },
      {
        kind: "ul",
        items: [
          "We do not guarantee the quality, suitability, or fitness of any tutor for any particular student",
          "We are not liable for any loss, damage, or injury arising from tutoring sessions arranged through the Platform",
          "We are not responsible for the conduct, actions, or omissions of any tutor or parent using the Platform",
          "We are not liable for any disputes arising between tutors and parents regarding sessions, fees, or conduct after the first session",
          "We do not guarantee the continuous, uninterrupted, or error free operation of the Platform",
        ],
      },
      {
        kind: "p",
        text: "Our total liability to any user, for any claim arising out of or in connection with the Platform, shall not exceed the amount paid by that user to TuitionLanka.",
      },
    ],
  },
  {
    title: "11. Intellectual Property",
    content: [
      {
        kind: "p",
        text: "All content on the Platform, including but not limited to text, graphics, logos, and design, is the property of TuitionLanka or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content from the Platform without our prior written consent.",
      },
      {
        kind: "p",
        text: "Tutor profile content submitted by tutors remains the intellectual property of the respective tutor. By submitting profile content, tutors grant TuitionLanka a non-exclusive licence to display that content on the Platform for the purpose of facilitating tutor-parent matching.",
      },
    ],
  },
  {
    title: "12. Account Suspension and Termination",
    content: [
      {
        kind: "p",
        text: "TuitionLanka reserves the right to suspend or terminate any user account, tutor or parent at any time and without prior notice, if:",
      },
      {
        kind: "ul",
        items: [
          "The user is found to have provided false or misleading information",
          "The user has breached any provision of these Terms",
          "The user has engaged in conduct harmful to other users, students, or the Platform",
          "Required by law or regulatory authority",
        ],
      },
      {
        kind: "p",
        text: "Tutors may deactivate their account at any time by contacting us at support.tuitionlanka@gmail.com.",
      },
    ],
  },
  {
    title: "13. Privacy",
    content: [
      {
        kind: "p",
        text: "Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy at www.tuitionlanka.com/privacy-policy to understand our data collection and use practices.",
      },
    ],
  },
  {
    title: "14. Governing Law",
    content: [
      {
        kind: "p",
        text: "These Terms shall be governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.",
      },
    ],
  },
  {
    title: "15. Changes to These Terms",
    content: [
      {
        kind: "p",
        text: "We reserve the right to update or modify these Terms at any time. Material changes will be communicated by updating the effective date at the top of this document. Your continued use of the Platform after any changes constitutes your acceptance of the revised Terms.",
      },
    ],
  },
];

// ── Translation helpers ───────────────────────────────────────────────────────

function flattenStrings(
  heroTitle: string,
  heroSubtitle: string,
  introText: string,
  sections: Section[],
): string[] {
  const strings: string[] = [heroTitle, heroSubtitle, introText];
  for (const section of sections) {
    strings.push(section.title);
    for (const item of section.content) {
      if (item.kind === "ul") strings.push(...item.items);
      else strings.push(item.text);
    }
  }
  return strings;
}

function applyTranslations(translated: string[]) {
  let idx = 0;
  const t = (fallback: string) => translated[idx++] ?? fallback;

  return {
    heroTitle: t(HERO_TITLE),
    heroSubtitle: t(HERO_SUBTITLE),
    introText: t(INTRO_TEXT),
    sections: SECTIONS.map((section) => ({
      title: t(section.title),
      content: section.content.map((item) => {
        if (item.kind === "ul") {
          return { ...item, items: item.items.map((s) => t(s)) };
        }
        return { ...item, text: t(item.text) };
      }),
    })),
  };
}

const ORIGINAL_STRINGS = flattenStrings(
  HERO_TITLE,
  HERO_SUBTITLE,
  INTRO_TEXT,
  SECTIONS,
);

type PageData = ReturnType<typeof applyTranslations>;

const ORIGINAL_DATA: PageData = applyTranslations(ORIGINAL_STRINGS);

const cache = new Map<string, PageData>();

// ── Render helper ─────────────────────────────────────────────────────────────

function renderItem(item: ContentItem, key: number): React.ReactNode {
  switch (item.kind) {
    case "p":
      return <p key={key}>{item.text}</p>;
    case "ul":
      return (
        <ul key={key} className="list-disc list-inside space-y-1">
          {item.items.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      );
    case "label":
      return (
        <p key={key} className="font-semibold text-gray-800">
          {item.text}
        </p>
      );
    case "h3":
      return (
        <h3 key={key} className="font-bold text-gray-800 mb-1">
          {item.text}
        </h3>
      );
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TermsAndConditionsContent() {
  const locale = useLocale();
  const tDoc = useTranslations("legalDocument");
  const [data, setData] = useState<PageData>(ORIGINAL_DATA);

  useEffect(() => {
    if (locale === "en") {
      setData(ORIGINAL_DATA);
      return;
    }

    if (cache.has(locale)) {
      setData(cache.get(locale)!);
      return;
    }

    let cancelled = false;

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: ORIGINAL_STRINGS, locale }),
    })
      .then((r) => r.json())
      .then(({ translated }: { translated: string[] }) => {
        if (cancelled || !Array.isArray(translated)) return;
        const result = applyTranslations(translated);
        cache.set(locale, result);
        setData(result);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <>
      {/* Hero banner */}
      <div className="relative h-44 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white px-8 py-6 flex flex-col justify-center overflow-hidden mb-8">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
            {tDoc("eyebrow")}
          </p>
          <h1 className="text-3xl text-white md:text-3xl font-bold leading-tight">
            {data.heroTitle}
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-1">
            {data.heroSubtitle}
          </p>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
      </div>

      {/* Page body */}
      <div className="rounded-3xl bg-lightgrey px-4 py-8 sm:px-8 lg:px-10">
        {/* Intro notice */}
        <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">
            {tDoc("lastUpdated")}: April 23, 2026
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {data.introText}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {data.sections.map((section, si) => (
            <section
              key={si}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-bold text-gray-900">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
                {section.content.map((item, ci) => renderItem(item, ci))}
              </div>
            </section>
          ))}

          {/* Contact section (static — contact details must not be translated) */}
          <LegalContactSection
            sectionNumber={16}
            documentName="Terms and Conditions"
          />
        </div>
      </div>
    </>
  );
}
