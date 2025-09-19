import { FetchTuitionRatesRequest } from "@/types/request-types";
import { PaginatedResponse, TuitionRateItem } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

// Extend baseApi for tuition rates
export const TuitionRatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ Fetch all tuition rates (paginated)
    fetchTuitionRates: build.query<PaginatedResponse<TuitionRateItem>, FetchTuitionRatesRequest>({
      query: ({ tuitionRateId, ...rest }) => ({
        url: Endpoints.TuitionRates,
        method: "GET",
        params: rest,
      }),
      providesTags: ["TuitionRates"],
    }),

    // ✅ Fetch a single tuition rate by ID
    fetchTuitionRatesById: build.query<TuitionRateItem, { tuitionRateId: string }>({
      query: ({ tuitionRateId }) => ({
        url: `${Endpoints.TuitionRates}/${tuitionRateId}`,
        method: "GET",
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
} = TuitionRatesApi;
