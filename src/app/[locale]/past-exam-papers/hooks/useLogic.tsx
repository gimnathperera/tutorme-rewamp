import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { Option } from "@/types/shared-types";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Paper } from "@/types/response-types";
import { useFetchPapersQuery } from "@/store/api/splits/papers";
import {
  initialFormValues,
  PaperSearchSchema,
  paperSearchSchema,
} from "../components/form-test-papper-search/schema";

const PAPERS_PER_PAGE = 12;
const PAPER_MEDIUM_OPTIONS: Option[] = [
  { label: "Sinhala", value: "Sinhala" },
  { label: "English", value: "English" },
  { label: "Tamil", value: "Tamil" },
];

type LogicReturnType = {
  forms: {
    testPaperSearchForm: UseFormReturn<PaperSearchSchema>;
  };
  actions: {
    setCurrentPage: Dispatch<SetStateAction<number>>;
  };
  derivedData: {
    gradesOptions: Option[];
    subjectOptions: Option[];
    mediumOptions: Option[];
    yearOptions: Option[];
    isGradesLoading: boolean;
    isSubjectsLoading: boolean;
    isPapersLoading: boolean;
    isYearLoading: boolean;
    papers: Paper[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
    isEdexcelGradeSelected: boolean;
    defaultYear: string;
  };
};

const useLogic = (): LogicReturnType => {
  const [currentPage, setCurrentPage] = useState(1);

  const testPaperSearchForm = useForm<PaperSearchSchema>({
    resolver: zodResolver(paperSearchSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });
  const { setValue } = testPaperSearchForm;

  const [selectedGrade, selectedSubject, selectedMedium, fromYear, toYear] =
    testPaperSearchForm.watch(["grade", "subject", "medium", "fromYear", "toYear"]);

  // Fetch oldest and latest years from the database
  const { data: oldestPaperData, isLoading: isOldestLoading } =
    useFetchPapersQuery({ limit: 1, page: 1, sortBy: "year:asc" });

  const { data: latestPaperData, isLoading: isLatestLoading } =
    useFetchPapersQuery({ limit: 1, page: 1, sortBy: "year:desc" });

  const oldestYear = oldestPaperData?.results[0]?.year ?? "";
  const latestYear = latestPaperData?.results[0]?.year ?? "";
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

  // Set both dropdowns to latest year once loaded (only once)
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
    if (fromYear !== fromYearRef.current && parseInt(fromYear) > parseInt(toYear)) {
      setValue("toYear", fromYear);
    } else if (toYear !== toYearRef.current && parseInt(toYear) < parseInt(fromYear)) {
      setValue("fromYear", toYear);
    }
    fromYearRef.current = fromYear;
    toYearRef.current = toYear;
  }, [fromYear, toYear, setValue]);

  const { data: gradesRowData, isLoading: isGradesLoading } =
    useFetchGradesQuery({ limit: 1000, page: 1 });

  const isExactYear = !!fromYear && !!toYear && fromYear === toYear;
  const isRangeYear = !!fromYear && !!toYear && fromYear !== toYear;

  const paperQueryParams = useMemo(
    () => ({
      limit: PAPERS_PER_PAGE,
      page: currentPage,
      // exact match uses existing backend `year` param
      year: isExactYear ? fromYear : undefined,
      // range uses new backend params (requires backend update)
      fromYear: isRangeYear ? fromYear : undefined,
      toYear: isRangeYear ? toYear : undefined,
      grade: selectedGrade || undefined,
      subject: selectedSubject || undefined,
      medium: selectedMedium || undefined,
      sortBy: "createdAt:desc",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage, selectedGrade, selectedMedium, selectedSubject, fromYear, toYear, isExactYear, isRangeYear],
  );

  const {
    data: papersData,
    isLoading: isPapersInitialLoading,
    isFetching: isPapersFetching,
  } = useFetchPapersQuery(paperQueryParams);

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

  const isFirstGradeMount = useRef(true);
  useEffect(() => {
    if (isFirstGradeMount.current) {
      isFirstGradeMount.current = false;
      return;
    }
    setValue("subject", "", { shouldValidate: false, shouldDirty: true });
  }, [selectedGrade, setValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGrade, selectedSubject, selectedMedium, fromYear, toYear]);

  const isEdexcelGradeSelected =
    !!selectedGrade &&
    gradesOptions.some(
      (grade) => grade.value === selectedGrade && /edexcel/i.test(grade.label),
    );

  return {
    forms: { testPaperSearchForm },
    actions: { setCurrentPage },
    derivedData: {
      gradesOptions,
      subjectOptions,
      mediumOptions: PAPER_MEDIUM_OPTIONS,
      yearOptions,
      isGradesLoading,
      isSubjectsLoading: isGradesLoading,
      isPapersLoading: isPapersInitialLoading || isPapersFetching,
      isYearLoading,
      papers: papersData?.results || [],
      currentPage: papersData?.page || currentPage,
      totalPages: papersData?.totalPages || 0,
      totalResults: papersData?.totalResults || 0,
      isEdexcelGradeSelected,
      defaultYear: latestYear,
    },
  };
};

export default useLogic;
