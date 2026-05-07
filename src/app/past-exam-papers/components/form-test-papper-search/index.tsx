"use client";

import InputSelect from "@/components/shared/input-select";
import { Option } from "@/types/shared-types";
import { Search, X } from "lucide-react";
import { FC } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { initialFormValues, PaperSearchSchema } from "./schema";

type Props = {
  gradesOptions: Option[];
  subjectOptions: Option[];
  mediumOptions: Option[];
  testPaperSearchForm: UseFormReturn<PaperSearchSchema>;
  isGradesLoading: boolean;
  isSubjectsLoading: boolean;
  isMediumsLoading: boolean;
};

const FormTestPaperSearch: FC<Props> = ({
  gradesOptions,
  subjectOptions,
  mediumOptions,
  testPaperSearchForm,
  isGradesLoading,
  isSubjectsLoading,
  isMediumsLoading,
}) => {
  const onSubmit = (data: PaperSearchSchema) => {
    console.log("Form Submitted", data);
  };

  const hasActiveFilters =
    !!testPaperSearchForm.watch("grade") ||
    !!testPaperSearchForm.watch("subject") ||
    !!testPaperSearchForm.watch("medium") ||
    !!testPaperSearchForm.watch("search");

  return (
    <FormProvider {...testPaperSearchForm}>
      <form onSubmit={testPaperSearchForm.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Search and narrow papers by grade, subject, or medium.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => testPaperSearchForm.reset(initialFormValues)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1 mb-6">
          <label className="text-sm font-medium text-gray-700">
            Search Papers
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              {...testPaperSearchForm.register("search")}
              type="text"
              placeholder="Search by paper title, subject, or year"
              autoComplete="off"
              className="block w-full rounded-md border border-linegrey px-3 py-2 pl-10 pr-9 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
            {!!testPaperSearchForm.watch("search") && (
              <button
                type="button"
                onClick={() => testPaperSearchForm.setValue("search", "", { shouldDirty: true })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <InputSelect
            label="Select Grade"
            name="grade"
            options={gradesOptions}
            loading={isGradesLoading}
            placeholder="All Grades"
            disablePlaceholder={false}
          />
          <InputSelect
            label="Select Subject"
            name="subject"
            options={subjectOptions}
            loading={isSubjectsLoading}
            placeholder="All Subjects"
            disablePlaceholder={false}
          />
          <InputSelect
            label="Select Medium"
            name="medium"
            options={mediumOptions}
            disabled={isMediumsLoading || mediumOptions.length === 0}
            loading={isMediumsLoading}
            placeholder="All Mediums"
            disablePlaceholder={false}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default FormTestPaperSearch;
