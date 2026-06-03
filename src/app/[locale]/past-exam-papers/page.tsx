"use client";

import FormTestPaperSearch from "./components/form-test-papper-search";
import TestPaperList from "./components/test-papper-list";
import useLogic from "./hooks/useLogic";
import WhatsAppButton from "@/components/shared/whatapp-button";
import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Option } from "@/types/shared-types";
import { Paper } from "@/types/response-types";

const PEARSON_URL =
  "https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html";
const clientTranslationCache = new Map<string, string>();

async function translateTexts(texts: string[], locale: string) {
  if (!texts.length || locale === "en") return texts;

  const results = new Array<string>(texts.length);
  const toFetch: { index: number; text: string }[] = [];

  texts.forEach((text, index) => {
    if (!text?.trim()) {
      results[index] = text ?? "";
      return;
    }

    const key = `${locale}:${text}`;
    if (clientTranslationCache.has(key)) {
      results[index] = clientTranslationCache.get(key)!;
      return;
    }

    toFetch.push({ index, text });
  });

  if (toFetch.length === 0) return results;

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: toFetch.map((item) => item.text),
        locale,
      }),
    });

    if (!response.ok) throw new Error("Translation request failed");

    const { translated } = (await response.json()) as {
      translated: string[];
    };

    toFetch.forEach(({ index, text }, translatedIndex) => {
      const result = translated?.[translatedIndex] ?? text;
      results[index] = result;
      clientTranslationCache.set(`${locale}:${text}`, result);
    });
  } catch {
    toFetch.forEach(({ index, text }) => {
      results[index] = text;
    });
  }

  return results;
}

function useTranslatedDisplayItems<T>(
  items: T[],
  // eslint-disable-next-line unused-imports/no-unused-vars
  getTexts: (item: T) => string[],
  // eslint-disable-next-line unused-imports/no-unused-vars
  applyTexts: (item: T, texts: string[]) => T,
) {
  const locale = useLocale();
  const getTextsRef = useRef(getTexts);
  const applyTextsRef = useRef(applyTexts);
  getTextsRef.current = getTexts;
  applyTextsRef.current = applyTexts;

  const contentKey = useMemo(() => {
    if (locale === "en") return "";

    return `${locale}:${items
      .map((item) => getTextsRef.current(item).join("\0"))
      .join("\n")}`;
  }, [items, locale]);
  const hasPendingTranslations = useMemo(() => {
    if (locale === "en" || items.length === 0) return false;

    return items.some((item) =>
      getTextsRef
        .current(item)
        .some(
          (text) =>
            text?.trim() && !clientTranslationCache.has(`${locale}:${text}`),
        ),
    );
  }, [items, locale]);

  const [translatedItems, setTranslatedItems] = useState(items);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (locale === "en") {
      setTranslatedItems(items);
      setIsTranslating(false);
      return;
    }

    if (items.length === 0) {
      setTranslatedItems([]);
      setIsTranslating(false);
      return;
    }

    let cancelled = false;
    setIsTranslating(true);

    const run = async () => {
      const textGroups = items.map((item) => getTextsRef.current(item));
      const translatedTexts = await translateTexts(textGroups.flat(), locale);

      if (cancelled) return;

      let offset = 0;
      const nextItems = items.map((item, index) => {
        const textCount = textGroups[index].length;
        const texts = translatedTexts.slice(offset, offset + textCount);
        offset += textCount;
        return applyTextsRef.current(item, texts);
      });

      setTranslatedItems(nextItems);
      setIsTranslating(false);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [contentKey, items, locale]);

  const shouldWaitForTranslations = isTranslating || hasPendingTranslations;

  return {
    items:
      locale === "en"
        ? items
        : shouldWaitForTranslations
          ? []
          : translatedItems,
    isTranslating: shouldWaitForTranslations,
  };
}

const EdexcelRedirectNotice = () => {
  const t = useTranslations("pastExamPapers");
  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t("edexcelHeading")}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            {t("edexcelBody1")}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t("edexcelBody2")}{" "}
            <a
              href={PEARSON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
            >
              {t("edexcelLink")}
              <ExternalLink size={14} />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const TestPapers = () => {
  const t = useTranslations("pastExamPapers");

  const {
    derivedData: {
      gradesOptions,
      subjectOptions,
      mediumOptions,
      isGradesLoading,
      isSubjectsLoading,
      papers: availablePapers,
      isPapersLoading,
      currentPage,
      totalPages,
      totalResults,
      isEdexcelGradeSelected,
    },
    actions: { setCurrentPage },
    forms: { testPaperSearchForm },
  } = useLogic();

  const { items: translatedPapers, isTranslating: isPapersTranslating } =
    useTranslatedDisplayItems<Paper>(
      availablePapers,
      (paper) => [
        paper.subject?.title ?? "",
        paper.grade?.title ?? "",
        paper.title ?? "",
      ],
      (paper, [subjectTitle, gradeTitle, title]) => ({
        ...paper,
        title: title ?? paper.title,
        subject: paper.subject
          ? { ...paper.subject, title: subjectTitle }
          : paper.subject,
        grade: paper.grade
          ? { ...paper.grade, title: gradeTitle }
          : paper.grade,
      }),
    );

  const { items: translatedGradesOptions, isTranslating: isGradesTranslating } =
    useTranslatedDisplayItems<Option>(
      gradesOptions,
      (opt) => [opt.label],
      (opt, [label]) => ({ ...opt, label: label ?? opt.label }),
    );

  const {
    items: translatedSubjectOptions,
    isTranslating: isSubjectsTranslating,
  } = useTranslatedDisplayItems<Option>(
    subjectOptions,
    (opt) => [opt.label],
    (opt, [label]) => ({ ...opt, label: label ?? opt.label }),
  );

  const {
    items: translatedMediumOptions,
    isTranslating: isMediumsTranslating,
  } = useTranslatedDisplayItems<Option>(
    mediumOptions,
    (opt) => [opt.label],
    (opt, [label]) => ({ ...opt, label: label ?? opt.label }),
  );

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className=" py-4 m-3">
        <h2 className="text-4xl font-bold text-center">{t("pageHeading")}</h2>
        <h3 className="mx-auto mt-3 max-w-2xl text-xl font-normal text-center opacity-50">
          {t("pageSubheading")}
        </h3>
      </div>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-3xl">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {t("sectionHeading")}
        </h2>

        <FormTestPaperSearch
          gradesOptions={translatedGradesOptions}
          subjectOptions={translatedSubjectOptions}
          mediumOptions={translatedMediumOptions}
          testPaperSearchForm={testPaperSearchForm}
          isGradesLoading={isGradesLoading || isGradesTranslating}
          isSubjectsLoading={isSubjectsLoading || isSubjectsTranslating}
          isMediumsLoading={isMediumsTranslating}
        />
      </div>

      {isEdexcelGradeSelected ? (
        <EdexcelRedirectNotice />
      ) : (
        <TestPaperList
          availablePapers={translatedPapers}
          isPapersLoading={isPapersLoading || isPapersTranslating}
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          onPageChange={setCurrentPage}
        />
      )}
      <WhatsAppButton />
    </div>
  );
};

export default TestPapers;
