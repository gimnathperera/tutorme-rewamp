import { FetchSubjectsRequest } from "@/types/request-types";
import { PaginatedResponse, Subject } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const SubjectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchSubjects: build.query<
      PaginatedResponse<Subject>,
      FetchSubjectsRequest
    >({
      query: (payload) => {
        const { subjectId, ...rest } = payload;
        return {
          url: Endpoints.Subjects,
          method: "GET",
          params: rest,
        };
      },
      providesTags: ["Subjects"],
    }),
    fetchSubjectById: build.query<Subject, string>({
      query: (id) => ({
        url: `${Endpoints.Subjects}/${id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchSubjectsQuery,
  useFetchSubjectByIdQuery,
  useLazyFetchSubjectByIdQuery,
} = SubjectsApi;
