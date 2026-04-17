"use client";

import InputSelect from "@/components/shared/input-select";
import InputText from "@/components/shared/input-text";
import { Option } from "@/types/shared-types";
import { Search } from "lucide-react";
import { FC, useEffect, useRef } from "react";
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

  const selectedGrade = testPaperSearchForm.watch("grade");
  const selectedSubject = testPaperSearchForm.watch("subject");
  const prevGradeRef = useRef<string | null>(null);
  const prevSubjectRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      prevGradeRef.current !== null &&
      prevGradeRef.current !== selectedGrade
    ) {
      testPaperSearchForm.setValue("subject", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    prevGradeRef.current = selectedGrade;
  }, [selectedGrade, testPaperSearchForm]);

  useEffect(() => {
    if (
      prevSubjectRef.current !== null &&
      prevSubjectRef.current !== selectedSubject
    ) {
      testPaperSearchForm.setValue("medium", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    prevSubjectRef.current = selectedSubject;
  }, [selectedSubject, testPaperSearchForm]);

  return (
    <FormProvider {...testPaperSearchForm}>
      <form onSubmit={testPaperSearchForm.handleSubmit(onSubmit)}>
        <div className="relative mb-6">
          <Search
            className="pointer-events-none absolute left-3 top-[2.6rem] z-10 h-4 w-4 text-gray-400"
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
            disabled={!selectedGrade}
            loading={isSubjectsLoading}
          />
          <InputSelect
            label="Select Medium"
            name="medium"
            options={mediumOptions}
            disabled={
              !selectedGrade ||
              !selectedSubject ||
              isMediumsLoading ||
              mediumOptions.length === 0
            }
            loading={isMediumsLoading}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default FormTestPaperSearch;
