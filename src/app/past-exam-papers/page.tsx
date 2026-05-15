"use client";

import FormTestPaperSearch from "./components/form-test-papper-search";
import TestPaperList from "./components/test-papper-list";
import useLogic from "./hooks/useLogic";
import WhatsAppButton from "@/components/shared/whatapp-button";
import { ExternalLink } from "lucide-react";

const PEARSON_URL =
  "https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html";

const EdexcelRedirectNotice = () => (
  <div className="max-w-7xl mx-auto mt-8 px-4">
    <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edexcel Past Papers
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Due to copyright restrictions, we are unable to share Edexcel past
          papers on our website.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          However, you can access all official past papers directly through the
          Pearson Edexcel website.{" "}
          <a
            href={PEARSON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
          >
            Access here: Pearson Edexcel Past Papers
            <ExternalLink size={14} />
          </a>
        </p>
      </div>
    </div>
  </div>
);

const TestPapers = () => {
  const {
    derivedData: {
      gradesOptions,
      subjectOptions,
      mediumOptions,
      isGradesLoading,
      isSubjectsLoading,
      papers: availablePapers,
      isPapersLoading,
      isEdexcelGradeSelected,
    },
    forms: { testPaperSearchForm },
  } = useLogic();

  return (
    <div className=" max-w-7xl mx-auto pt-12 pb-24 ">
      <div className=" py-4 m-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Download Sri Lankan Past Exam Papers for Free
        </h2>
        <h3 className="text-xl sm:text-2xl font-normal text-center pt-4 sm:pt-10 opacity-50">
          Grade 5 Scholarship, O/L, A/L & Grade 1–13. Explore a complete
          database of Sri Lanka past exam papers, including Grade 5 Scholarship
          papers, GCE O/L past papers, and GCE A/L past papers. Download free
          model papers, school test papers, and previous exam questions for all
          grades and subjects.
        </h3>
      </div>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-3xl">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Download Past Exam Papers
        </h2>

        <FormTestPaperSearch
          gradesOptions={gradesOptions}
          subjectOptions={subjectOptions}
          mediumOptions={mediumOptions}
          testPaperSearchForm={testPaperSearchForm}
          isGradesLoading={isGradesLoading}
          isSubjectsLoading={isSubjectsLoading}
          isMediumsLoading={isPapersLoading}
        />
      </div>

      {isEdexcelGradeSelected ? (
        <EdexcelRedirectNotice />
      ) : (
        <TestPaperList
          availablePapers={availablePapers}
          isPapersLoading={isPapersLoading}
        />
      )}
      <WhatsAppButton />
    </div>
  );
};

export default TestPapers;
