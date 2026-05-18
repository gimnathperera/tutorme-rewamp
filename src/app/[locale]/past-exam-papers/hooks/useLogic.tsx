import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { Option } from "@/types/shared-types";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

    return ["title", "name", "label", "text", "value", "id", "_id"].flatMap(
      (key) => extractRawStringValues(record[key]),
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
      record._id,
    );
    const optionValue = getFirstRawStringValue(
      record.id,
      record._id,
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
      : ["title", "name", "label", "text", "value", "id", "_id"].flatMap(
          (key) => extractMediumOptions(record[key]),
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

const getPaperGradeValues = (paper: Paper): string[] => {
  return extractStringValues(paper.grade);
};

const getPaperSubjectValues = (paper: Paper): string[] => {
  return extractStringValues(paper.subject);
};

const getPaperSubjectOptions = (papers: Paper[]): Option[] => {
  const optionsMap = new Map<string, Option>();

  papers.forEach((paper) => {
    extractMediumOptions(paper.subject).forEach((option) => {
      const optionKey = normalizeFilterValue(String(option.value));

      if (optionKey && !optionsMap.has(optionKey)) {
        optionsMap.set(optionKey, option);
      }
    });
  });

  return Array.from(optionsMap.values());
};

const getPaperMediumOptions = (papers: Paper[]): Option[] => {
  const optionsMap = new Map<string, Option>();

  papers.forEach((paper) => {
    const rawPaper = paper as Paper & Record<string, unknown>;

    [rawPaper.medium, rawPaper.language, rawPaper.languages, rawPaper.mediums]
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
    isEdexcelGradeSelected: boolean;
  };
};

const PAPER_LIMIT = 10000;
const useLogic = (): LogicReturnType => {
  const [papers, setPapers] = useState<Paper[]>([]);

  const testPaperSearchForm = useForm({
    resolver: zodResolver(paperSearchSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });
  const { setValue } = testPaperSearchForm;

  const [selectedGrade, selectedSubject, selectedMedium, searchTerm] =
    testPaperSearchForm.watch(["grade", "subject", "medium", "search"]);

  const { data: gradesRowData, isLoading: isGradesLoading } =
    useFetchGradesQuery({
      limit: 1000,
      page: 1,
    });

  const [fetchPapers, { isLoading: isPapersLoading }] =
    useLazyFetchPapersQuery();

  const fetchTestPapers = useCallback(async () => {
    const result = await fetchPapers({
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
  }, [fetchPapers]);

  useEffect(() => {
    fetchTestPapers();
  }, [fetchTestPapers]);

  const gradesOptions =
    gradesRowData?.results.map((grade) => ({
      label: grade.title,
      value: grade.id.toString(),
    })) || [];

  const subjectOptions = useMemo(() => {
    if (selectedGrade) {
      const selectedGradeData = gradesRowData?.results.find(
        (g) => g.id.toString() === selectedGrade,
      );
      if (selectedGradeData?.subjects?.length) {
        return selectedGradeData.subjects.map((s) => ({
          label: s.title,
          value: s.id,
        }));
      }
    }
    return getPaperSubjectOptions(papers);
  }, [selectedGrade, gradesRowData, papers]);
  const mediumOptions = useMemo(() => getPaperMediumOptions(papers), [papers]);

  useEffect(() => {
    if (!selectedMedium) return;

    const selectedMediumExists = mediumOptions.some(
      (option) => String(option.value) === selectedMedium,
    );

    if (!selectedMediumExists) {
      setValue("medium", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [mediumOptions, selectedMedium, setValue]);

  const isFirstGradeMount = useRef(true);
  useEffect(() => {
    if (isFirstGradeMount.current) {
      isFirstGradeMount.current = false;
      return;
    }
    setValue("subject", "", {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [selectedGrade, setValue]);

  const normalizedSearchTerm = normalizeFilterValue(searchTerm);
  const normalizedSelectedGrade = normalizeFilterValue(selectedGrade);
  const normalizedSelectedSubject = normalizeFilterValue(selectedSubject);
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
      !normalizedSearchTerm || searchableContent.includes(normalizedSearchTerm);

    const matchesGrade =
      !normalizedSelectedGrade ||
      getPaperGradeValues(paper).includes(normalizedSelectedGrade);
    const matchesSubject =
      !normalizedSelectedSubject ||
      getPaperSubjectValues(paper).includes(normalizedSelectedSubject);
    const paperMediumValues = getPaperMediumValues(paper);
    const matchesMedium =
      !normalizedSelectedMedium ||
      paperMediumValues.includes(normalizedSelectedMedium);

    return matchesSearch && matchesGrade && matchesSubject && matchesMedium;
  });

  const isEdexcelGradeSelected =
    !!selectedGrade &&
    gradesOptions.some(
      (g) => g.value === selectedGrade && /edexcel/i.test(g.label),
    );

  return {
    forms: {
      testPaperSearchForm,
    },
    derivedData: {
      gradesOptions,
      subjectOptions,
      mediumOptions,
      isGradesLoading,
      isSubjectsLoading: isPapersLoading,
      isPapersLoading,
      papers: filteredPapers,
      isEdexcelGradeSelected,
    },
  };
};

export default useLogic;
