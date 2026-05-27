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
    isGradesLoading: boolean;
    isSubjectsLoading: boolean;
    isPapersLoading: boolean;
    papers: Paper[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
    isEdexcelGradeSelected: boolean;
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

  const [selectedGrade, selectedSubject, selectedMedium, searchTerm] =
    testPaperSearchForm.watch(["grade", "subject", "medium", "search"]);
  const selectedYear = searchTerm.trim();
  const isFullYearSearch = /^\d{4}$/.test(selectedYear);

  const { data: gradesRowData, isLoading: isGradesLoading } =
    useFetchGradesQuery({
      limit: 1000,
      page: 1,
    });

  const paperQueryParams = useMemo(
    () => ({
      limit: PAPERS_PER_PAGE,
      page: currentPage,
      year: isFullYearSearch ? selectedYear : undefined,
      yearSearch: selectedYear && !isFullYearSearch ? selectedYear : undefined,
      grade: selectedGrade || undefined,
      subject: selectedSubject || undefined,
      medium: selectedMedium || undefined,
      sortBy: "createdAt:desc",
    }),
    [
      currentPage,
      selectedGrade,
      selectedMedium,
      selectedSubject,
      isFullYearSearch,
      selectedYear,
    ],
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

    setValue("subject", "", {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [selectedGrade, setValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGrade, selectedSubject, selectedMedium]);

  const isEdexcelGradeSelected =
    !!selectedGrade &&
    gradesOptions.some(
      (grade) => grade.value === selectedGrade && /edexcel/i.test(grade.label),
    );

  return {
    forms: {
      testPaperSearchForm,
    },
    actions: {
      setCurrentPage,
    },
    derivedData: {
      gradesOptions,
      subjectOptions,
      mediumOptions: PAPER_MEDIUM_OPTIONS,
      isGradesLoading,
      isSubjectsLoading: isGradesLoading,
      isPapersLoading: isPapersInitialLoading || isPapersFetching,
      papers: papersData?.results || [],
      currentPage: papersData?.page || currentPage,
      totalPages: papersData?.totalPages || 0,
      totalResults: papersData?.totalResults || 0,
      isEdexcelGradeSelected,
    },
  };
};

export default useLogic;
