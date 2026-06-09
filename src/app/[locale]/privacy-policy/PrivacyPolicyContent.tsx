"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import LegalContactSection from "@/components/shared/legal-contact-section";

// ── Types ─────────────────────────────────────────────────────────────────────

type ContentItem =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "label"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "contact-info" };

type Section = { title: string; content: ContentItem[] };

// ── Static content data ───────────────────────────────────────────────────────

const HERO_TITLE = "Privacy Policy";
const HERO_SUBTITLE =
  "How we collect, use, and protect information on TuitionLanka.";
const INTRO_TEXT =
  "This Privacy Policy explains how TuitionLanka handles personal information when you use our website, submit a request, register as a tutor, or communicate with us.";

const SECTIONS: Section[] = [
  {
    title: "1. Introduction",
    content: [
      {
        kind: "p",
        text: 'TuitionLanka ("we," "us," or "our") is an online platform that connects parents and students with qualified and verified home tutors across Sri Lanka. We are committed to protecting the privacy of all users who access or use our website at www.tuitionlanka.com (the "Platform"). This Privacy Policy explains what personal information we collect, how we use it, and the rights you have in relation to it.',
      },
      {
        kind: "p",
        text: "By using the Platform, you agree to the collection and use of information in accordance with this policy.",
      },
    ],
  },
  {
    title: "2. Who We Are",
    content: [
      {
        kind: "p",
        text: "TuitionLanka is currently operated by SOFTVIL TECHNOLOGIES (PVT) LTD (Registration No:PV102511). The Platform is managed and maintained by the SOFTVIL TECHNOLOGIES team, reachable at:",
      },
      { kind: "contact-info" },
    ],
  },
  {
    title: "3. Information We Collect",
    content: [
      { kind: "h3", text: "3.1 Information Collected from Tutors" },
      {
        kind: "p",
        text: "When registering as a tutor on the Platform, we collect the following:",
      },
      { kind: "label", text: "Personal Information" },
      {
        kind: "ul",
        items: [
          "Full name",
          "Email address",
          "Contact number",
          "Race and nationality (used solely for tutor student matching preferences)",
          "Gender",
          "Date of birth",
        ],
      },
      { kind: "label", text: "Professional Information" },
      {
        kind: "ul",
        items: [
          "Class type preference",
          "Preferred teaching locations",
          "Tutor type (e.g. Physical, online)",
          "Highest education level",
          "Years of teaching experience",
          "Teaching mediums",
          "Grades and subjects offered",
          "Per session fee and charges",
        ],
      },
      { kind: "label", text: "Profile Content" },
      {
        kind: "ul",
        items: [
          "Short personal introduction",
          "Summary of teaching experience and academic achievements",
          "Student results and track record",
          "Other selling points as a tutor",
        ],
      },
      { kind: "label", text: "Verification Documents" },
      {
        kind: "p",
        text: "Tutors are required to submit supporting documents (e.g. national identity card, degree certificates, professional credentials, or student ID) for the purpose of identity and qualification verification. These documents are reviewed manually by our administrative team and are treated with strict confidentiality.",
      },
      { kind: "label", text: "Account Credentials" },
      {
        kind: "p",
        text: "Tutors create a username and password upon registration to access their account on the Platform.",
      },
      {
        kind: "h3",
        text: "3.2 Information Collected from Parents / Students",
      },
      { kind: "p", text: "When submitting a tutor request, we collect:" },
      {
        kind: "ul",
        items: [
          "Full name of the parent or guardian",
          "Email address",
          "Contact number",
          "District and city",
          "Preferred tutor medium, grade, number of tutors required",
          "Session duration, frequency, and class type",
          "Preferred tutor type",
        ],
      },
      {
        kind: "p",
        text: "We do not collect the personal details (name, age, or identification) of the child directly. We only collect the academic preferences relevant to finding a suitable tutor.",
      },
      { kind: "h3", text: "3.3 Automatically Collected Information" },
      {
        kind: "p",
        text: "When you visit the Platform, we may automatically collect certain technical data, including:",
      },
      {
        kind: "ul",
        items: [
          "IP address",
          "Browser type and version",
          "Pages visited and time spent on the Platform",
          "Referring URLs",
        ],
      },
      {
        kind: "p",
        text: "This data is collected through Google Analytics and is used in aggregate, anonymised form for performance analysis and site improvement. Please refer to Google's Privacy Policy for more information on how Google processes this data.",
      },
    ],
  },
  {
    title: "4. How We Use Your Information",
    content: [
      {
        kind: "p",
        text: "We use the personal information we collect for the following purposes:",
      },
      {
        kind: "ul",
        items: [
          "To verify tutor identity and qualifications through our manual review process",
          "To create and manage tutor profiles on the Platform",
          "To match parent tutor requests with suitable, verified tutors based on expertise, location, availability, fees, and stated preferences including race and nationality",
          "To facilitate the tutor suggestion and selection process",
          "To process first session payments made by parents via bank transfer",
          "To share confirmed tutor contact details with parents upon successful payment",
          "To communicate with users regarding their registration, requests, or enquiries",
          "To improve and optimise the Platform using anonymised analytics data",
          "To comply with any applicable legal obligations",
        ],
      },
    ],
  },
  {
    title: "5. Payment Information",
    content: [
      {
        kind: "p",
        text: "TuitionLanka collects a first session fee from parents as part of the tutor confirmation process. This fee corresponds to the advertised first session charge of the selected tutor. Payments are made via bank transfer directly to TuitionLanka.",
      },
      {
        kind: "p",
        text: "We do not collect, store, or process credit card details or other payment card information on the Platform. Bank transfer details shared for payment purposes are used solely to process the transaction.",
      },
      {
        kind: "p",
        text: "From the second session onwards, all fee arrangements are made directly between the parent and the tutor, and TuitionLanka is not a party to those transactions.",
      },
    ],
  },
  {
    title: "6. Sensitive Personal Data",
    content: [
      {
        kind: "p",
        text: "We collect race and nationality information from tutors for the sole purpose of fulfilling matching preferences indicated by parents when requesting a tutor. This data is:",
      },
      {
        kind: "ul",
        items: [
          "Not used for any discriminatory purpose",
          "Not shared with third parties beyond what is necessary for the matching process",
          "Stored securely and accessible only to authorised personnel",
        ],
      },
      {
        kind: "p",
        text: "By providing this information, tutors consent to its use for the matching purposes described above. Tutors may contact us at any time to request its removal, subject to any operational limitations this may impose on matching.",
      },
    ],
  },
  {
    title: "7. Sharing of Your Information",
    content: [
      {
        kind: "p",
        text: "We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:",
      },
      {
        kind: "ul",
        items: [
          "With the other party (tutor or parent) once a match has been confirmed and first session payment received limited to contact details required to arrange sessions",
          "With Google Analytics for aggregate, anonymised website performance analysis",
          "With authorised TuitionLanka staff involved in tutor verification and tutor parent matching",
          "Where required by law, regulation, or a valid legal process",
        ],
      },
    ],
  },
  {
    title: "8. Data Retention",
    content: [
      {
        kind: "p",
        text: "We retain your personal information for as long as necessary to provide the services described in this policy, or as required by applicable law. Specifically:",
      },
      {
        kind: "ul",
        items: [
          "Tutor profiles and account data are retained for as long as the tutor account remains active",
          "Parent tutor request data is retained for the duration of the active engagement and for a reasonable period thereafter for record keeping purposes",
          "Verification documents submitted by tutors are retained for the period required for compliance and quality assurance",
        ],
      },
      {
        kind: "p",
        text: "You may request deletion of your personal data at any time by contacting us at support.tuitionlanka@gmail.com. We will process your request subject to any legal retention obligations.",
      },
    ],
  },
  {
    title: "9. Data Security",
    content: [
      {
        kind: "p",
        text: "We take reasonable technical and organisational measures to protect your personal information from unauthorised access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or method of electronic storage is completely secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.",
      },
    ],
  },
  {
    title: "10. Children's Privacy",
    content: [
      {
        kind: "p",
        text: "TuitionLanka's services are directed at parents and adult tutors. We do not knowingly collect personal information directly from children under the age of 18. Parents use the Platform to request tutoring for their children, but no personal data of the child is collected by us directly.",
      },
      {
        kind: "p",
        text: "All tutors registering on the Platform must be 18 years of age or older and must provide valid supporting documentation as part of the verification process.",
      },
    ],
  },
  {
    title: "11. Cookies and Analytics",
    content: [
      {
        kind: "p",
        text: "The Platform uses Google Analytics to understand how visitors interact with our website. Google Analytics uses cookies, small text files placed on your device to collect standard internet log information and visitor behaviour information in an anonymous form.",
      },
      {
        kind: "p",
        text: "You may opt out of Google Analytics tracking by installing the Google Analytics Opt out Browser Add on, available at https://tools.google.com/dlpage/gaoptout.",
      },
    ],
  },
  {
    title: "12. Your Rights",
    content: [
      { kind: "p", text: "As a user of the Platform, you have the right to:" },
      {
        kind: "ul",
        items: [
          "Access the personal information we hold about you",
          "Request correction of inaccurate or incomplete information",
          "Request deletion of your personal data, subject to legal retention requirements",
          "Withdraw consent for the processing of sensitive data (such as race and nationality) at any time",
          "Raise a concern or complaint regarding how your data is handled",
        ],
      },
      {
        kind: "p",
        text: "To exercise any of these rights, please contact us at support.tuitionlanka@gmail.com.",
      },
    ],
  },
  {
    title: "13. Changes to This Privacy Policy",
    content: [
      {
        kind: "p",
        text: "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. When we make material changes, we will update the effective date at the top of this document. We encourage you to review this policy periodically.",
      },
      {
        kind: "p",
        text: "Continued use of the Platform after any changes constitutes your acceptance of the updated policy.",
      },
    ],
  },
];

// ── Translation helpers ───────────────────────────────────────────────────────

/** Flatten all translatable strings into a single ordered array. */
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
      if (item.kind === "contact-info") continue;
      if (item.kind === "ul") strings.push(...item.items);
      else strings.push(item.text);
    }
  }
  return strings;
}

/** Reconstruct the page data structure using translated strings (same order). */
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
        if (item.kind === "contact-info") return item;
        if (item.kind === "ul") {
          return { ...item, items: item.items.map((s) => t(s)) };
        }
        return { ...item, text: t(item.text) };
      }),
    })),
  };
}

// Pre-compute original flat strings once (module-level, stable)
const ORIGINAL_STRINGS = flattenStrings(
  HERO_TITLE,
  HERO_SUBTITLE,
  INTRO_TEXT,
  SECTIONS,
);

type PageData = ReturnType<typeof applyTranslations>;

const ORIGINAL_DATA: PageData = applyTranslations(ORIGINAL_STRINGS);

// Client-side cache so locale switches don't re-fetch
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
        <h3 key={key} className="text-base font-bold text-gray-800 mb-1">
          {item.text}
        </h3>
      );
    case "contact-info":
      return (
        <React.Fragment key={key}>
          <p>
            <span className="font-semibold text-gray-800">Email:</span>{" "}
            support.tuitionlanka@gmail.com
          </p>
          <p>
            <span className="font-semibold text-gray-800">Website:</span>{" "}
            https://www.tuitionlanka.com
          </p>
        </React.Fragment>
      );
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PrivacyPolicyContent() {
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
            sectionNumber={14}
            documentName="Privacy Policy"
          />
        </div>
      </div>
    </>
  );
}
