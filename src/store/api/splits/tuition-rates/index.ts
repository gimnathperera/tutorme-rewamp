import { FetchTuitionRatesRequest } from "@/types/request-types";
import { PaginatedResponse, TuitionRateItem } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

// Extend baseApi for tuition rates
export type GradeCountResponse = {
  count: number;
  grades: {
    _id: string;
    title: string;
    description?: string;
    tuitionRateCount: number;
  }[];
};

export const TuitionRatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ Fetch all tuition rates (paginated)
    fetchTuitionRates: build.query<
      PaginatedResponse<TuitionRateItem>,
      FetchTuitionRatesRequest
    >({
      query: ({ tuitionRateId, ...rest }) => ({
        url: Endpoints.TuitionRates,
        method: "GET",
        params: rest,
      }),
      providesTags: ["TuitionRates"],
    }),

    // ✅ Fetch a single tuition rate by ID
    fetchTuitionRatesById: build.query<
      TuitionRateItem,
      { tuitionRateId: string }
    >({
      query: ({ tuitionRateId }) => ({
        url: `${Endpoints.TuitionRates}/${tuitionRateId}`,
        method: "GET",
      }),
      providesTags: ["TuitionRates"],
    }),

    // ✅ Fetch grades with tuition rate counts
    fetchGradesWithCounts: build.query<GradeCountResponse, void>({
      query: () => ({
        url: Endpoints.GradesWithCounts,
        method: "GET",
      }),
      providesTags: ["Grades"],
    }),

    // ✅ Fetch tuition rates by grade ID
    fetchTuitionRatesByGrade: build.query<
      PaginatedResponse<TuitionRateItem>,
      { gradeId: string; limit?: number; page?: number }
    >({
      query: ({ gradeId, ...rest }) => ({
        url: `${Endpoints.TuitionRatesByGrade}/${gradeId}`,
        method: "GET",
        params: rest,
      }),
      providesTags: ["TuitionRates"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for use in components
export const {
  useFetchTuitionRatesQuery,
  useFetchTuitionRatesByIdQuery,
  useFetchGradesWithCountsQuery,
  useFetchTuitionRatesByGradeQuery,
  useLazyFetchTuitionRatesByGradeQuery,
} = TuitionRatesApi;
