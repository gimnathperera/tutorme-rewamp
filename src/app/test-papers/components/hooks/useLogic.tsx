import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  initialFormValues,
  paperSearchSchema,
} from "../form-test-papper-search/schema";
import { Option } from "@/types/shared-types";
import {
  useFetchGradesQuery,
  useLazyFetchGradeByIdQuery,
} from "@/store/api/splits/grades";
import { useCallback, useEffect, useState } from "react";
import { getErrorInApiResult } from "@/utils/api";
import toast from "react-hot-toast";
import { Paper } from "@/types/response-types";
import { useLazyFetchPapersQuery } from "@/store/api/splits/papers";

type LogicReturnType = {
  forms: {
    testPaperSearchForm: UseFormReturn<
      {
        grade: string;
        subject: string;
      },
      any,
      undefined
    >;
  };
  derivedData: {
    gradesOptions: Option[];
    subjectOptions: Option[];
    isGradesLoading: boolean;
    isSubjectsLoading: boolean;
    isPapersLoading: boolean;
    papers: Paper[];
  };
};

const PAPER_LIMIT = 100;
const useLogic = (): LogicReturnType => {
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);

  const testPaperSearchForm = useForm({
    resolver: zodResolver(paperSearchSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const [selectedGrade, selectedSubject] = testPaperSearchForm.watch([
    "grade",
    "subject",
  ]);

  // TODO: options will be fetched from a different API endpoint in the future
  const { data: gradesRowData, isLoading: isGradesLoading } =
    useFetchGradesQuery({
      limit: 100,
      page: 1,
    });

  // TODO: options will be fetched from a different API endpoint in the future
  const [fetchSubjectsByGrade, { isLoading: isSubjectsLoading }] =
    useLazyFetchGradeByIdQuery();

  const [fetchPapers, { isLoading: isPapersLoading }] =
    useLazyFetchPapersQuery();

  const fetchSubjects = useCallback(
    async (gradeId: string) => {
      const result = await fetchSubjectsByGrade(gradeId);
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }

      if (result.data) {
        setSubjectOptions(
          result.data.subjects.map((subject) => ({
            label: subject.title,
            value: subject.id.toString(),
          }))
        );
      }
    },
    [fetchSubjectsByGrade]
  );

  const fetchTestPapers = useCallback(
    async (grade: string, subject: string) => {
      const result = await fetchPapers({
        grade,
        subject,
        limit: PAPER_LIMIT,
        page: 1,
      });
      const error = getErrorInApiResult(result);
      if (error) {
        return toast.error(error);
      }
      if (result.data) {
        setPapers(result.data.results);
      }
    },
    [fetchPapers]
  );

  useEffect(() => {
    if (selectedGrade && selectedSubject) {
      fetchTestPapers(selectedGrade, selectedSubject);
    }
  }, [fetchTestPapers, selectedGrade, selectedSubject]);

  useEffect(() => {
    if (selectedGrade) {
      fetchSubjects(selectedGrade);
    } else {
      setSubjectOptions([]);
      testPaperSearchForm.setValue("subject", "");
    }
  }, [fetchSubjects, selectedGrade, testPaperSearchForm]);

  const gradesOptions =
    gradesRowData?.results.map((grade) => ({
      label: grade.title,
      value: grade.id.toString(),
    })) || [];

  return {
    forms: {
      testPaperSearchForm,
    },
    derivedData: {
      gradesOptions,
      subjectOptions,
      isGradesLoading,
      isSubjectsLoading,
      isPapersLoading,
      papers,
    },
  };
};

export default useLogic;
