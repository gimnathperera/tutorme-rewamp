import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { Option } from "@/types/shared-types";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Paper } from "@/types/response-types";
import {
  useFetchPapersQuery,
  useFetchPaperExamTypesQuery,
} from "@/store/api/splits/papers";
import {
  initialFormValues,
  PaperSearchSchema,
  paperSearchSchema,
} from "../components/form-test-papper-search/schema";
import { useTranslateItems } from "@/hooks/useTranslateItems";

const PAPERS_PER_PAGE = 12;
const PAPER_MEDIUM_OPTIONS: Option[] = [
  { label: "Sinhala", value: "Sinhala" },
  { label: "English", value: "English" },
  { label: "Tamil", value: "Tamil" },
];

type AppliedFilters = {
  grade?: string;
  subject?: string;
  medium?: string;
  fromYear?: string;
  toYear?: string;
  examType?: string;
};

/** Returns the allowed exam type IDs for a given grade title, or null = show all. */
function getExamTypesForGrade(gradeTitle: string): string[] | null {
  const t = gradeTitle.toLowerCase();
  if (/cambridge/i.test(t))
    return ["Cambridge Exam", "Model Paper", "Term Test"];
  if (/edexcel/i.test(t)) return ["Edexcel Exam", "Model Paper", "Term Test"];
  if (/ordinary level|o\/l/.test(t) || /grade 1[01]/.test(t))
    return ["GCE Exam", "Term Test", "Model Paper"];
  if (/advanced level|a\/l/.test(t) || /grade 1[23]/.test(t))
    return ["GCE Exam", "Term Test", "Model Paper"];
  if (/grade 5/.test(t))
    return ["Scholarship Exam", "Term Test", "Model Paper"];
  if (/grade [1-4](?!\d)/.test(t)) return ["Term Test", "Model Paper"];
  if (/grade [6-9](?!\d)/.test(t)) return ["Term Test", "Model Paper"];
  return null;
}

type LogicReturnType = {
  forms: {
    testPaperSearchForm: UseFormReturn<PaperSearchSchema>;
  };
  actions: {
    setCurrentPage: Dispatch<SetStateAction<number>>;
    onSearch: () => void;
  };
  derivedData: {
    gradesOptions: Option[];
    subjectOptions: Option[];
    mediumOptions: Option[];
    yearOptions: Option[];
    examTypeOptions: Option[];
    isGradesLoading: boolean;
    isSubjectsLoading: boolean;
    isPapersLoading: boolean;
    isYearLoading: boolean;
    isExamTypesLoading: boolean;
    papers: Paper[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
    isEdexcelGradeSelected: boolean;
    defaultYear: string;
    hasGrade: boolean;
  };
};

const useLogic = (): LogicReturnType => {
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});

  const testPaperSearchForm = useForm<PaperSearchSchema>({
    resolver: zodResolver(paperSearchSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });
  const { setValue, reset } = testPaperSearchForm;

  const [
    selectedGrade,
    selectedSubject,
    selectedMedium,
    fromYear,
    toYear,
    selectedExam,
  ] = testPaperSearchForm.watch([
    "grade",
    "subject",
    "medium",
    "fromYear",
    "toYear",
    "exam",
  ]);

  const hasGrade = !!selectedGrade;

  // Fetch oldest and latest years from the database
  const { data: oldestPaperData, isLoading: isOldestLoading } =
    useFetchPapersQuery({ limit: 1, page: 1, sortBy: "year:asc" });

  const { data: latestPaperData, isLoading: isLatestLoading } =
    useFetchPapersQuery({ limit: 1, page: 1, sortBy: "year:desc" });

  const oldestYear = String(oldestPaperData?.results[0]?.year ?? "");
  const latestYear = String(latestPaperData?.results[0]?.year ?? "");
  const isYearLoading = isOldestLoading || isLatestLoading;

  // Build year options (newest → oldest)
  const yearOptions = useMemo<Option[]>(() => {
    if (!oldestYear || !latestYear) return [];
    const start = parseInt(oldestYear);
    const end = parseInt(latestYear);
    const options: Option[] = [];
    for (let y = end; y >= start; y--) {
      options.push({ label: y.toString(), value: y.toString() });
    }
    return options;
  }, [oldestYear, latestYear]);

  // Set both year dropdowns to latest year once loaded (only once)
  const hasSetDefaults = useRef(false);
  useEffect(() => {
    if (latestYear && !hasSetDefaults.current) {
      setValue("fromYear", latestYear);
      setValue("toYear", latestYear);
      hasSetDefaults.current = true;
    }
  }, [latestYear, setValue]);

  // Auto-correct: keep fromYear <= toYear
  const fromYearRef = useRef(fromYear);
  const toYearRef = useRef(toYear);
  useEffect(() => {
    if (!fromYear || !toYear) {
      fromYearRef.current = fromYear;
      toYearRef.current = toYear;
      return;
    }
    if (
      fromYear !== fromYearRef.current &&
      parseInt(fromYear) > parseInt(toYear)
    ) {
      setValue("toYear", fromYear);
    } else if (
      toYear !== toYearRef.current &&
      parseInt(toYear) < parseInt(fromYear)
    ) {
      setValue("fromYear", toYear);
    }
    fromYearRef.current = fromYear;
    toYearRef.current = toYear;
  }, [fromYear, toYear, setValue]);

  const { data: gradesRowData, isLoading: isGradesLoading } =
    useFetchGradesQuery({ limit: 1000, page: 1 });

  const { data: examTypesData, isLoading: isExamTypesLoading } =
    useFetchPaperExamTypesQuery();

  // Build RTK Query params from appliedFilters (click-triggered, {} = all papers)
  const paperQueryParams = useMemo(() => {
    const { fromYear: af, toYear: at, ...rest } = appliedFilters;
    const isExact = af && at && af === at;
    const isRange = af && at && af !== at;
    return {
      limit: PAPERS_PER_PAGE,
      page: currentPage,
      year: isExact ? af : undefined,
      fromYear: isRange ? af : undefined,
      toYear: isRange ? at : undefined,
      ...rest,
      sortBy: "year:desc,subjectTitle:asc",
    };
  }, [appliedFilters, currentPage]);

  const {
    data: papersData,
    isLoading: isPapersInitialLoading,
    isFetching: isPapersFetching,
  } = useFetchPapersQuery(paperQueryParams);

  // Search handler — only updates appliedFilters on button click
  const onSearch = useCallback(() => {
    setAppliedFilters({
      grade: selectedGrade || undefined,
      subject: selectedSubject || undefined,
      medium: selectedMedium || undefined,
      fromYear: fromYear || undefined,
      toYear: toYear || undefined,
      examType: selectedExam || undefined,
    });
    setCurrentPage(1);
  }, [
    selectedGrade,
    selectedSubject,
    selectedMedium,
    fromYear,
    toYear,
    selectedExam,
  ]);

  const gradesOptions = useMemo(
    () =>
      gradesRowData?.results.map((grade) => ({
        label: grade.title,
        value: grade.id.toString(),
      })) || [],
    [gradesRowData],
  );

  const subjectOptions = useMemo(() => {
    if (selectedGrade) {
      const selectedGradeData = gradesRowData?.results.find(
        (grade) => grade.id.toString() === selectedGrade,
      );
      return (
        selectedGradeData?.subjects?.map((subject) => ({
          label: subject.title,
          value: subject.id,
        })) || []
      );
    }
    const subjectsById = new Map<string, Option>();
    gradesRowData?.results.forEach((grade) => {
      grade.subjects?.forEach((subject) => {
        if (!subjectsById.has(subject.id)) {
          subjectsById.set(subject.id, {
            label: subject.title,
            value: subject.id,
          });
        }
      });
    });
    return Array.from(subjectsById.values());
  }, [selectedGrade, gradesRowData]);

  // Build exam type options filtered by selected grade
  const examTypeOptions = useMemo<Option[]>(() => {
    const allTypes = examTypesData?.examTypes ?? [];
    if (!selectedGrade)
      return allTypes.map((t) => ({ label: t.title, value: t.id }));
    const selectedGradeTitle =
      gradesRowData?.results.find((g) => g.id.toString() === selectedGrade)
        ?.title ?? "";
    const allowed = getExamTypesForGrade(selectedGradeTitle);
    const filtered = allowed
      ? allTypes.filter((t) =>
          allowed.some(
            (a) =>
              t.title.toLowerCase().includes(a.toLowerCase()) ||
              a.toLowerCase().includes(t.title.toLowerCase()),
          ),
        )
      : allTypes;
    return filtered.map((t) => ({ label: t.title, value: t.id }));
  }, [selectedGrade, examTypesData, gradesRowData]);

  const translatedExamTypeOptions = useTranslateItems(
    examTypeOptions,
    (o) => [o.label],
    (o, [label]) => ({ ...o, label: label ?? o.label }),
  );

  // Reset subject + exam when grade changes
  const isFirstGradeMount = useRef(true);
  useEffect(() => {
    if (isFirstGradeMount.current) {
      isFirstGradeMount.current = false;
      return;
    }
    setValue("subject", "", { shouldValidate: false, shouldDirty: true });
    setValue("exam", "", { shouldValidate: false, shouldDirty: true });
  }, [selectedGrade, setValue]);

  // When grade is cleared → reset form + clear results
  const prevGradeRef = useRef(selectedGrade);
  useEffect(() => {
    const prev = prevGradeRef.current;
    prevGradeRef.current = selectedGrade;
    if (prev && !selectedGrade) {
      reset({ ...initialFormValues, fromYear: latestYear, toYear: latestYear });
      setAppliedFilters({});
      setCurrentPage(1);
    }
  }, [selectedGrade, latestYear, reset]);

  const isEdexcelGradeSelected =
    !!selectedGrade &&
    gradesOptions.some(
      (grade) => grade.value === selectedGrade && /edexcel/i.test(grade.label),
    );

  return {
    forms: { testPaperSearchForm },
    actions: { setCurrentPage, onSearch },
    derivedData: {
      gradesOptions,
      subjectOptions,
      mediumOptions: PAPER_MEDIUM_OPTIONS,
      yearOptions,
      examTypeOptions: translatedExamTypeOptions,
      isGradesLoading,
      isSubjectsLoading: isGradesLoading,
      isPapersLoading: isPapersInitialLoading || isPapersFetching,
      isYearLoading,
      isExamTypesLoading,
      papers: papersData?.results || [],
      currentPage: papersData?.page || currentPage,
      totalPages: papersData?.totalPages || 0,
      totalResults: papersData?.totalResults || 0,
      isEdexcelGradeSelected,
      defaultYear: latestYear,
      hasGrade,
    },
  };
};

export default useLogic;
