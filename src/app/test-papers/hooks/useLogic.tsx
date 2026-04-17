import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { Option } from "@/types/shared-types";
import {
  useFetchGradesQuery,
  useLazyFetchGradeByIdQuery,
} from "@/store/api/splits/grades";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorInApiResult } from "@/utils/api";
import toast from "react-hot-toast";
import { Paper } from "@/types/response-types";
import { useLazyFetchPapersQuery } from "@/store/api/splits/papers";
import {
  initialFormValues,
  PaperSearchSchema,
  paperSearchSchema,
} from "../components/form-test-papper-search/schema";

const normalizeFilterValue = (value: string) => value.trim().toLowerCase();

const extractRawStringValues = (value: unknown): string[] => {
  if (typeof value === "string" || typeof value === "number") {
    const trimmedValue = String(value).trim();

    return trimmedValue ? [trimmedValue] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(extractRawStringValues);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return ["title", "name", "label", "text", "value", "id"].flatMap((key) =>
      extractRawStringValues(record[key]),
    );
  }

  return [];
};

const extractStringValues = (value: unknown): string[] => {
  return extractRawStringValues(value).map(normalizeFilterValue);
};

const getFirstRawStringValue = (...values: unknown[]) =>
  values.flatMap(extractRawStringValues)[0] || "";

const extractMediumOptions = (value: unknown): Option[] => {
  if (typeof value === "string" || typeof value === "number") {
    const trimmedValue = String(value).trim();

    return trimmedValue
      ? [
          {
            label: trimmedValue,
            value: trimmedValue,
          },
        ]
      : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(extractMediumOptions);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const label = getFirstRawStringValue(
      record.title,
      record.name,
      record.label,
      record.text,
      record.value,
      record.id,
    );
    const optionValue = getFirstRawStringValue(
      record.id,
      record.value,
      record.title,
      record.name,
      record.label,
      record.text,
    );

    return label && optionValue
      ? [
          {
            label,
            value: optionValue,
          },
        ]
      : ["title", "name", "label", "text", "value", "id"].flatMap((key) =>
          extractMediumOptions(record[key]),
        );
  }

  return [];
};

const getPaperMediumValues = (paper: Paper): string[] => {
  const rawPaper = paper as Paper & Record<string, unknown>;

  return [
    rawPaper.medium,
    rawPaper.language,
    rawPaper.languages,
    rawPaper.mediums,
  ].flatMap(extractStringValues);
};

const getPaperMediumOptions = (papers: Paper[]): Option[] => {
  const optionsMap = new Map<string, Option>();

  papers.forEach((paper) => {
    const rawPaper = paper as Paper & Record<string, unknown>;

    [
      rawPaper.medium,
      rawPaper.language,
      rawPaper.languages,
      rawPaper.mediums,
    ]
      .flatMap(extractMediumOptions)
      .forEach((option) => {
        const optionKey = normalizeFilterValue(String(option.value));

        if (optionKey && !optionsMap.has(optionKey)) {
          optionsMap.set(optionKey, option);
        }
      });
  });

  return Array.from(optionsMap.values());
};

type LogicReturnType = {
  forms: {
    testPaperSearchForm: UseFormReturn<PaperSearchSchema>;
  };
  derivedData: {
    gradesOptions: Option[];
    subjectOptions: Option[];
    mediumOptions: Option[];
    isGradesLoading: boolean;
    isSubjectsLoading: boolean;
    isPapersLoading: boolean;
    papers: Paper[];
  };
};

const PAPER_LIMIT = 10000;
const useLogic = (): LogicReturnType => {
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);

  const testPaperSearchForm = useForm({
    resolver: zodResolver(paperSearchSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const [selectedGrade, selectedSubject, selectedMedium, searchTerm] =
    testPaperSearchForm.watch(["grade", "subject", "medium", "search"]);

  // TODO: options will be fetched from a different API endpoint in the future
  const { data: gradesRowData, isLoading: isGradesLoading } =
    useFetchGradesQuery({
      limit: 1000,
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
          })),
        );
      }
    },
    [fetchSubjectsByGrade],
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
    [fetchPapers],
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

  const mediumOptions = useMemo(() => getPaperMediumOptions(papers), [papers]);

  useEffect(() => {
    if (!selectedGrade || !selectedSubject) {
      setPapers([]);
      testPaperSearchForm.setValue("medium", "", {
        shouldValidate: true,
      });
    }
  }, [selectedGrade, selectedSubject, testPaperSearchForm]);

  useEffect(() => {
    if (!selectedMedium) return;

    const selectedMediumExists = mediumOptions.some(
      (option) => String(option.value) === selectedMedium,
    );

    if (!selectedMediumExists) {
      testPaperSearchForm.setValue("medium", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [mediumOptions, selectedMedium, testPaperSearchForm]);

  const normalizedSearchTerm = normalizeFilterValue(searchTerm);
  const normalizedSelectedMedium = normalizeFilterValue(selectedMedium);

  const filteredPapers = papers.filter((paper) => {
    const searchableContent = [
      paper.title,
      paper.subject?.title,
      paper.grade?.title,
      paper.year,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearchTerm ||
      searchableContent.includes(normalizedSearchTerm);

    const paperMediumValues = getPaperMediumValues(paper);
    const matchesMedium =
      !normalizedSelectedMedium ||
      paperMediumValues.some(
        (value) =>
          value.includes(normalizedSelectedMedium) ||
          normalizedSelectedMedium.includes(value),
      );

    return matchesSearch && matchesMedium;
  });

  return {
    forms: {
      testPaperSearchForm,
    },
    derivedData: {
      gradesOptions,
      subjectOptions,
      mediumOptions,
      isGradesLoading,
      isSubjectsLoading,
      isPapersLoading,
      papers: filteredPapers,
    },
  };
};

export default useLogic;
