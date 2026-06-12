import { FetchPapersRequest } from "@/types/request-types";
import { PaginatedResponse, Paper } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export type ExamTypeOption = { id: string; title: string };

export const PaperApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPapers: build.query<PaginatedResponse<Paper>, FetchPapersRequest>({
      query: (payload) => ({
        url: Endpoints.Papers,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Papers"],
    }),
    fetchPaperExamTypes: build.query<{ examTypes: ExamTypeOption[] }, void>({
      query: () => ({
        url: Endpoints.PaperExamTypes,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchPapersQuery,
  useLazyFetchPapersQuery,
  useFetchPaperExamTypesQuery,
} = PaperApi;
