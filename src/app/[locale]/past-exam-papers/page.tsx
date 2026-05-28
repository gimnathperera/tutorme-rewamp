"use client";

import FormTestPaperSearch from "./components/form-test-papper-search";
import TestPaperList from "./components/test-papper-list";
import useLogic from "./hooks/useLogic";
import WhatsAppButton from "@/components/shared/whatapp-button";
import { ExternalLink } from "lucide-react";
import { useTranslateItems } from "@/hooks/useTranslateItems";
import { useTranslations } from "next-intl";

const PEARSON_URL =
  "https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html";

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

  // Translate paper fields for non-English locales
  const translatedPapers = useTranslateItems(
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
      grade: paper.grade ? { ...paper.grade, title: gradeTitle } : paper.grade,
    }),
  );

  // Translate dropdown options for the search form (labels only; values/IDs stay intact)
  const translatedGradesOptions = useTranslateItems(
    gradesOptions,
    (opt) => [opt.label],
    (opt, [label]) => ({ ...opt, label: label ?? opt.label }),
  );

  const translatedSubjectOptions = useTranslateItems(
    subjectOptions,
    (opt) => [opt.label],
    (opt, [label]) => ({ ...opt, label: label ?? opt.label }),
  );

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className=" py-4 m-3">
        <h2 className="text-4xl font-bold text-center">
          {t("pageHeading")}
        </h2>
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
          mediumOptions={mediumOptions}
          testPaperSearchForm={testPaperSearchForm}
          isGradesLoading={isGradesLoading}
          isSubjectsLoading={isSubjectsLoading}
          isMediumsLoading={false}
        />
      </div>

      {isEdexcelGradeSelected ? (
        <EdexcelRedirectNotice />
      ) : (
        <TestPaperList
          availablePapers={translatedPapers}
          isPapersLoading={isPapersLoading}
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
