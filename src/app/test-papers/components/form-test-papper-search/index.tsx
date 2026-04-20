"use client";

import InputSelect from "@/components/shared/input-select";
import InputText from "@/components/shared/input-text";
import { Option } from "@/types/shared-types";
import { Search } from "lucide-react";
import { FC } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { PaperSearchSchema } from "./schema";

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

  return (
    <FormProvider {...testPaperSearchForm}>
      <form onSubmit={testPaperSearchForm.handleSubmit(onSubmit)}>
        <div className="relative mb-6">
          <Search
            className="pointer-events-none absolute left-3 top-[2.45rem] z-10 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <InputText
            label="Search Papers"
            name="search"
            placeholder="Search by paper title, subject, or year"
            autoComplete="off"
            className="pl-10"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <InputSelect
            label="Select Grade"
            name="grade"
            options={gradesOptions}
            loading={isGradesLoading}
          />
          <InputSelect
            label="Select Subject"
            name="subject"
            options={subjectOptions}
            loading={isSubjectsLoading}
          />
          <InputSelect
            label="Select Medium"
            name="medium"
            options={mediumOptions}
            disabled={isMediumsLoading || mediumOptions.length === 0}
            loading={isMediumsLoading}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default FormTestPaperSearch;
