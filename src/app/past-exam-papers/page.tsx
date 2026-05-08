"use client";

import FormTestPaperSearch from "./components/form-test-papper-search";
import TestPaperList from "./components/test-papper-list";
import useLogic from "./hooks/useLogic";
import WhatsAppButton from "@/components/shared/whatapp-button";

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

      <TestPaperList
        availablePapers={availablePapers}
        isPapersLoading={isPapersLoading}
      />
      <WhatsAppButton />
    </div>
  );
};

export default TestPapers;
