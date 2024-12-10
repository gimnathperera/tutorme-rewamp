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
      query: (payload) => ({
        url: Endpoints.Subjects,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Subjects"],
    }),
  }),
  overrideExisting: false,
});

export const { useFetchSubjectsQuery } = SubjectsApi;
