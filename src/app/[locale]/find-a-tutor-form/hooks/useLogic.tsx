import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { Option } from "@/types/shared-types";

type LogicReturnType = {
  forms: {};
  derivedData: {
    gradesOptions: Option[];
    subjectsOptions: Option[];
  };
  loading: {
    isGradesLoading: boolean;
    isSubjectsLoading: boolean;
  };
};

const GRADE_LIMIT = 100;
const SUBJECT_LIMIT = 100;

const useLogic = (): LogicReturnType => {
  // TODO: options will be fetched from a different API endpoint in the future
  const { data: gradesRawData, isLoading: isGradesLoading } =
    useFetchGradesQuery({
      limit: GRADE_LIMIT,
      page: 1,
    });

  const { data: subjectsRawData, isLoading: isSubjectsLoading } =
    useFetchSubjectsQuery({
      limit: SUBJECT_LIMIT,
      page: 1,
    });

  const gradesOptions =
    gradesRawData?.results.map((grade) => ({
      label: grade.title,
      value: grade.id.toString(),
    })) || [];

  const subjectsOptions =
    subjectsRawData?.results.map((subject) => ({
      label: subject.title,
      value: subject.id.toString(),
    })) || [];

  return {
    forms: {},
    derivedData: {
      gradesOptions,
      subjectsOptions,
    },
    loading: {
      isGradesLoading,
      isSubjectsLoading,
    },
  };
};

export default useLogic;
