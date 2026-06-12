"use client";

import InputSelect from "@/components/shared/input-select";
import { Option } from "@/types/shared-types";
import { BookOpen, Calendar, Eraser, GraduationCap, Languages, ScrollText } from "lucide-react";
import { FC } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { initialFormValues, PaperSearchSchema } from "./schema";
import { useTranslations } from "next-intl";

type Props = {
  gradesOptions: Option[];
  subjectOptions: Option[];
  mediumOptions: Option[];
  yearOptions: Option[];
  examTypeOptions: Option[];
  testPaperSearchForm: UseFormReturn<PaperSearchSchema>;
  isGradesLoading: boolean;
  isSubjectsLoading: boolean;
  isMediumsLoading: boolean;
  isYearLoading: boolean;
  isExamTypesLoading: boolean;
  defaultYear: string;
  hasGrade: boolean;
  onSearch: () => void;
};

const FormTestPaperSearch: FC<Props> = ({
  gradesOptions,
  subjectOptions,
  mediumOptions,
  yearOptions,
  examTypeOptions,
  testPaperSearchForm,
  isGradesLoading,
  isSubjectsLoading,
  isMediumsLoading,
  isYearLoading,
  isExamTypesLoading,
  defaultYear,
  hasGrade,
  onSearch,
}) => {
  const t = useTranslations("pastExamPapers");

  const onSubmit = () => {
    onSearch();
  };

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
          {hasGrade && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-red-500 transition-colors"
            >
              <Eraser size={14} />
              {t("clearFilters")}
            </button>
          )}
        </div>

        {/* Row 1: Grade / Subject / Medium */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <InputSelect
            label={t("selectGrade")}
            name="grade"
            options={gradesOptions}
            loading={isGradesLoading}
            placeholder={t("allGrades")}
            disablePlaceholder={false}
            icon={<BookOpen size={14} />}
          />
          <InputSelect
            label={t("selectSubject")}
            name="subject"
            options={subjectOptions}
            loading={isSubjectsLoading}
            placeholder={t("allSubjects")}
            disablePlaceholder={false}
            disabled={!hasGrade}
            icon={<GraduationCap size={14} />}
          />
          <InputSelect
            label={t("selectMedium")}
            name="medium"
            options={mediumOptions}
            loading={isMediumsLoading}
            placeholder={t("allMediums")}
            disablePlaceholder={false}
            disabled={!hasGrade}
            icon={<Languages size={14} />}
          />
        </div>

        {/* Row 2: From Year — To Year | Select Exam */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-end gap-2 md:col-span-2">
            <div className="flex-1">
              <InputSelect
                label={t("fromYear")}
                name="fromYear"
                options={yearOptions}
                loading={isYearLoading}
                placeholder="—"
                disablePlaceholder={true}
                disabled={!hasGrade}
                icon={<Calendar size={14} />}
              />
            </div>
            <span className="mb-2 text-gray-400 font-medium select-none">—</span>
            <div className="flex-1">
              <InputSelect
                label={t("toYear")}
                name="toYear"
                options={yearOptions}
                loading={isYearLoading}
                placeholder="—"
                disablePlaceholder={true}
                disabled={!hasGrade}
                icon={<Calendar size={14} />}
              />
            </div>
          </div>
          <InputSelect
            label={t("selectExam")}
            name="exam"
            options={examTypeOptions}
            loading={isExamTypesLoading}
            placeholder={t("allExams")}
            disablePlaceholder={false}
            disabled={!hasGrade}
            icon={<ScrollText size={14} />}
          />
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={!hasGrade}
          className="w-full rounded-xl bg-primary-700 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("search")}
        </button>
      </form>
    </FormProvider>
  );
};

export default FormTestPaperSearch;
