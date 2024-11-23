"use client";

import IconButton from "@/components/shared/icon-button";
import FormTestPaperSearch from "./components/form-test-papper-search";

const TestPapers = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
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
      <div>
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl">
          <h2 className="text-lg font-bold mb-6 text-gray-800">
            Download Test Papers
          </h2>
          <FormTestPaperSearch />
          <div className="mt-20">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Available Test Papers
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-between bg-gray-100 p-3 rounded-lg py-4">
                <span className="text-gray-800">Term Test Papers</span>
                <IconButton icon="Download" />
              </li>
              <li className="flex items-center justify-between bg-gray-100 p-3 rounded-lg py-4">
                <span className="text-gray-800">Colombo School Papers</span>
                <IconButton icon="Download" />
              </li>
              <li className="flex items-center justify-between bg-gray-100 p-3 rounded-lg py-4">
                <span className="text-gray-800">Model Papers</span>
                <IconButton icon="Download" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPapers;
