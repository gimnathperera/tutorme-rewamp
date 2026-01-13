import { FetchTuitionAssignments } from "@/types/request-types";
import { TuitionAssignment, PaginatedResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const TuitionAssignmentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTuitionAssignments: build.query<
      PaginatedResponse<TuitionAssignment>,
      FetchTuitionAssignments
    >({
      query: (payload) => ({
        url: Endpoints.TuitionAssignments,
        method: "GET",
        params: payload,
      }),
      providesTags: ["TuitionAssignments"],
    }),
    fetchTuitionAssignmentById: build.query<TuitionAssignment, string>({
      query: (id) => ({
        url: `${Endpoints.TuitionAssignments}/${id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchTuitionAssignmentsQuery,
  useFetchTuitionAssignmentByIdQuery,
  useLazyFetchTuitionAssignmentByIdQuery,
} = TuitionAssignmentsApi;
