"use client";

import InputSelect from "@/components/shared/input-select";
import { Option } from "@/types/shared-types";
import { X } from "lucide-react";
import { FC } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { initialFormValues, PaperSearchSchema } from "./schema";
import { useTranslations } from "next-intl";

type Props = {
  gradesOptions: Option[];
  subjectOptions: Option[];
  mediumOptions: Option[];
  yearOptions: Option[];
  testPaperSearchForm: UseFormReturn<PaperSearchSchema>;
  isGradesLoading: boolean;
  isSubjectsLoading: boolean;
  isMediumsLoading: boolean;
  isYearLoading: boolean;
  defaultYear: string;
};

const FormTestPaperSearch: FC<Props> = ({
  gradesOptions,
  subjectOptions,
  mediumOptions,
  yearOptions,
  testPaperSearchForm,
  isGradesLoading,
  isSubjectsLoading,
  isMediumsLoading,
  isYearLoading,
  defaultYear,
}) => {
  const t = useTranslations("pastExamPapers");

  const onSubmit = (data: PaperSearchSchema) => {
    console.log("Form Submitted", data);
  };

  const fromYear = testPaperSearchForm.watch("fromYear");
  const toYear = testPaperSearchForm.watch("toYear");

  const hasActiveFilters =
    !!testPaperSearchForm.watch("grade") ||
    !!testPaperSearchForm.watch("subject") ||
    !!testPaperSearchForm.watch("medium") ||
    (!!defaultYear && fromYear !== defaultYear) ||
    (!!defaultYear && toYear !== defaultYear);

  const handleClear = () => {
    testPaperSearchForm.reset({
      ...initialFormValues,
      fromYear: defaultYear,
      toYear: defaultYear,
    });
  };

  return (
    <FormProvider {...testPaperSearchForm}>
      <form onSubmit={testPaperSearchForm.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{t("searchHint")}</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={14} />
              {t("clearFilters")}
            </button>
          )}
        </div>

        {/* Academic Year Range */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          <InputSelect
            label={t("fromYear")}
            name="fromYear"
            options={yearOptions}
            loading={isYearLoading}
            placeholder="—"
            disablePlaceholder={true}
          />
          <InputSelect
            label={t("toYear")}
            name="toYear"
            options={yearOptions}
            loading={isYearLoading}
            placeholder="—"
            disablePlaceholder={true}
          />
        </div>

        {/* Grade / Subject / Medium */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <InputSelect
            label={t("selectGrade")}
            name="grade"
            options={gradesOptions}
            loading={isGradesLoading}
            placeholder={t("allGrades")}
            disablePlaceholder={false}
          />
          <InputSelect
            label={t("selectSubject")}
            name="subject"
            options={subjectOptions}
            loading={isSubjectsLoading}
            placeholder={t("allSubjects")}
            disablePlaceholder={false}
          />
          <InputSelect
            label={t("selectMedium")}
            name="medium"
            options={mediumOptions}
            disabled={isMediumsLoading || mediumOptions.length === 0}
            loading={isMediumsLoading}
            placeholder={t("allMediums")}
            disablePlaceholder={false}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default FormTestPaperSearch;
