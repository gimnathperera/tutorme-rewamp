import { FetchGradesRequest } from "@/types/request-types";
import { Grade, PaginatedResponse, Subject } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const GradesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchGrades: build.query<PaginatedResponse<Grade>, FetchGradesRequest>({
      query: (payload) => ({
        url: Endpoints.Grades,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Grades"],
    }),
    fetchGradeById: build.query<Grade, string>({
      query: (id) => ({
        url: `${Endpoints.Grades}/${id}`,
        method: "GET",
      }),
    }),
    fetchSubjectsForGrades: build.mutation<
      Partial<PaginatedResponse<Subject>> & {
        count?: number;
        subjects: Subject[];
      },
      { gradeIds: string[]; page?: number; limit?: number; sortBy?: string }
    >({
      query: (body) => ({
        url: Endpoints.SubjectsByGrades,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchGradesQuery,
  useFetchGradeByIdQuery,
  useLazyFetchGradeByIdQuery,
  useFetchSubjectsForGradesMutation,
} = GradesApi;
