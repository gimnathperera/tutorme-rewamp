"use client";

import FormTestPapperSearch from "./components/form-test-papper-search";
import TestPapperList from "./components/test-papper-list";
import useLogic from "./hooks/useLogic";

const TestPapers = () => {
  const {
    derivedData: {
      gradesOptions,
      subjectOptions,
      isGradesLoading,
      isSubjectsLoading,
      papers: availablePapers,
      isPapersLoading,
    },
    forms: { testPaperSearchForm },
  } = useLogic();

  const isFormValid = testPaperSearchForm.formState.isValid;

  return (
    <div className="px-4 pt-12 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl py-4 m-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Get Your Study Materials!
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
          Select your grade and subject to download the papers you need for your
          studies.
          <br className="hidden sm:block" />
          It&apos;s quick, easy, and free!
        </h3>
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl">
        <h2 className="text-lg font-bold mb-6 text-gray-800">
          Download Test Papers
        </h2>

        <FormTestPapperSearch
          gradesOptions={gradesOptions}
          subjectOptions={subjectOptions}
          testPaperSearchForm={testPaperSearchForm}
          isGradesLoading={isGradesLoading}
          isSubjectsLoading={isSubjectsLoading}
        />
      </div>

      {isFormValid && (
        <TestPapperList
          availablePapers={availablePapers}
          isPapersLoading={isPapersLoading}
        />
      )}
    </div>
  );
};

export default TestPapers;
