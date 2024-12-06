import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  initialFormValues,
  paperSearchSchema,
} from "../form-test-papper-search/schema";
import { Option } from "@/types/shared-types";
import {
  useFetchGradeByIdQuery,
  useFetchGradesQuery,
  useLazyFetchGradeByIdQuery,
} from "@/store/api/splits/grades";
import { useCallback, useEffect, useState } from "react";
import { getErrorInApiResult } from "@/utils/api";
import toast from "react-hot-toast";

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
  };
};

const useLogic = (): LogicReturnType => {
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);

  const testPaperSearchForm = useForm({
    resolver: zodResolver(paperSearchSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const selectedGrade = testPaperSearchForm.watch("grade");

  // TODO: options will be fetched from a different API endpoint in the future
  const { data: gradesRowData, isLoading: isGradesLoading } =
    useFetchGradesQuery({
      limit: 100,
      page: 1,
    });

  // TODO: options will be fetched from a different API endpoint in the future
  const [fetchSubjectsByGrade, { isLoading: isSubjectsLoading }] =
    useLazyFetchGradeByIdQuery();

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
    },
  };
};

export default useLogic;
