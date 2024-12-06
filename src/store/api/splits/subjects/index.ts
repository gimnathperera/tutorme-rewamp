import { FetchSubjectsRequest } from "@/types/request-types";
import { PaginatedResponse, Subject } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const ProductsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchGrades: build.query<PaginatedResponse<Subject>, FetchSubjectsRequest>({
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

export const { useFetchGradesQuery } = ProductsApi;
