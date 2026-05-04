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
    <div className="px-4 pt-12 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl py-4 m-3">
        <h2 className="text-4xl font-bold text-center">
          Get Your Study Materials!
        </h2>
        <h3 className="text-xl font-normal text-center pt-4 sm:pt-10 opacity-50">
          Select your grade and subject to download the papers you need for your
          studies.
          <br className="hidden sm:block" />
          It&apos;s quick, easy, and free!
        </h3>
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl">
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
