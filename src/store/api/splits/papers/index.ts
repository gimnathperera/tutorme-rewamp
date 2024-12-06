import { FetchPapersRequest } from "@/types/request-types";
import { PaginatedResponse, Paper } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

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
  }),
  overrideExisting: false,
});

export const { useLazyFetchPapersQuery } = PaperApi;
