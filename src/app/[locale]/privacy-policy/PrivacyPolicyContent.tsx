"use client";

import React from "react";
import { useTranslations } from "next-intl";
import LegalContactSection from "@/components/shared/legal-contact-section";

// ── Render helper ─────────────────────────────────────────────────────────────

type ListItem = { kind: "ul"; items: string[] };
type TextItem = { kind: "p" | "label" | "h3"; text: string };
type ContactItem = { kind: "contact-info" };
type ContentItem = ListItem | TextItem | ContactItem;

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
  const tDoc = useTranslations("legalDocument");
  const t = useTranslations("privacyPolicy");

  const sections: { title: string; content: ContentItem[] }[] = [
    {
      title: t("s1Title"),
      content: [
        { kind: "p", text: t("s1p1") },
        { kind: "p", text: t("s1p2") },
      ],
    },
    {
      title: t("s2Title"),
      content: [{ kind: "p", text: t("s2p1") }, { kind: "contact-info" }],
    },
    {
      title: t("s3Title"),
      content: [
        { kind: "h3", text: t("s3h1") },
        { kind: "p", text: t("s3p1") },
        { kind: "label", text: t("s3l1") },
        {
          kind: "ul",
          items: [
            t("s3ul1i1"),
            t("s3ul1i2"),
            t("s3ul1i3"),
            t("s3ul1i4"),
            t("s3ul1i5"),
            t("s3ul1i6"),
          ],
        },
        { kind: "label", text: t("s3l2") },
        {
          kind: "ul",
          items: [
            t("s3ul2i1"),
            t("s3ul2i2"),
            t("s3ul2i3"),
            t("s3ul2i4"),
            t("s3ul2i5"),
            t("s3ul2i6"),
            t("s3ul2i7"),
            t("s3ul2i8"),
          ],
        },
        { kind: "label", text: t("s3l3") },
        {
          kind: "ul",
          items: [t("s3ul3i1"), t("s3ul3i2"), t("s3ul3i3"), t("s3ul3i4")],
        },
        { kind: "label", text: t("s3l4") },
        { kind: "p", text: t("s3p2") },
        { kind: "label", text: t("s3l5") },
        { kind: "p", text: t("s3p3") },
        { kind: "h3", text: t("s3h2") },
        { kind: "p", text: t("s3p4") },
        {
          kind: "ul",
          items: [
            t("s3ul4i1"),
            t("s3ul4i2"),
            t("s3ul4i3"),
            t("s3ul4i4"),
            t("s3ul4i5"),
            t("s3ul4i6"),
            t("s3ul4i7"),
          ],
        },
        { kind: "p", text: t("s3p5") },
        { kind: "h3", text: t("s3h3") },
        { kind: "p", text: t("s3p6") },
        {
          kind: "ul",
          items: [t("s3ul5i1"), t("s3ul5i2"), t("s3ul5i3"), t("s3ul5i4")],
        },
        { kind: "p", text: t("s3p7") },
      ],
    },
    {
      title: t("s4Title"),
      content: [
        { kind: "p", text: t("s4p1") },
        {
          kind: "ul",
          items: [
            t("s4ul1i1"),
            t("s4ul1i2"),
            t("s4ul1i3"),
            t("s4ul1i4"),
            t("s4ul1i5"),
            t("s4ul1i6"),
            t("s4ul1i7"),
            t("s4ul1i8"),
            t("s4ul1i9"),
          ],
        },
      ],
    },
    {
      title: t("s5Title"),
      content: [
        { kind: "p", text: t("s5p1") },
        { kind: "p", text: t("s5p2") },
        { kind: "p", text: t("s5p3") },
      ],
    },
    {
      title: t("s6Title"),
      content: [
        { kind: "p", text: t("s6p1") },
        { kind: "ul", items: [t("s6ul1i1"), t("s6ul1i2"), t("s6ul1i3")] },
        { kind: "p", text: t("s6p2") },
      ],
    },
    {
      title: t("s7Title"),
      content: [
        { kind: "p", text: t("s7p1") },
        {
          kind: "ul",
          items: [t("s7ul1i1"), t("s7ul1i2"), t("s7ul1i3"), t("s7ul1i4")],
        },
      ],
    },
    {
      title: t("s8Title"),
      content: [
        { kind: "p", text: t("s8p1") },
        { kind: "ul", items: [t("s8ul1i1"), t("s8ul1i2"), t("s8ul1i3")] },
        { kind: "p", text: t("s8p2") },
      ],
    },
    {
      title: t("s9Title"),
      content: [{ kind: "p", text: t("s9p1") }],
    },
    {
      title: t("s10Title"),
      content: [
        { kind: "p", text: t("s10p1") },
        { kind: "p", text: t("s10p2") },
      ],
    },
    {
      title: t("s11Title"),
      content: [
        { kind: "p", text: t("s11p1") },
        { kind: "p", text: t("s11p2") },
      ],
    },
    {
      title: t("s12Title"),
      content: [
        { kind: "p", text: t("s12p1") },
        {
          kind: "ul",
          items: [
            t("s12ul1i1"),
            t("s12ul1i2"),
            t("s12ul1i3"),
            t("s12ul1i4"),
            t("s12ul1i5"),
          ],
        },
        { kind: "p", text: t("s12p2") },
      ],
    },
    {
      title: t("s13Title"),
      content: [
        { kind: "p", text: t("s13p1") },
        { kind: "p", text: t("s13p2") },
      ],
    },
  ];

  return (
    <>
      {/* Hero banner */}
      <div className="relative h-44 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white px-8 py-6 flex flex-col justify-center overflow-hidden mb-8">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
            {tDoc("eyebrow")}
          </p>
          <h1 className="text-3xl text-white md:text-3xl font-bold leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-sm md:text-base text-white/80 mt-1">
            {t("heroSubtitle")}
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
            {t("introText")}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, si) => (
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

          {/* Contact section (static - contact details must not be translated) */}
          <LegalContactSection
            sectionNumber={14}
            documentName="Privacy Policy"
          />
        </div>
      </div>
    </>
  );
}
