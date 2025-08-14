import { FetchLevelRequest } from "@/types/request-types";
import { Level, PaginatedResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

// ✅ For all levels (paginated list)
export const LevelsApi = baseApi.injectEndpoints({

  endpoints: (build) => ({
    fetchLevels: build.query<PaginatedResponse<Level>, FetchLevelRequest>({
      query: (payload) => {
        const { levelId, ...rest } = payload;
        return {
          url: Endpoints.Levels,
          method: "GET",
          params: rest
        };
      },
      providesTags: ["LevelAndExams"],
    }),
  }),
  overrideExisting: false,
});

// ✅ For single level by ID
export const LevelsDetailsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchLevelsById: build.query<Level, { levelId: string }>({
      query: ({ levelId }) => ({
        url: `${Endpoints.Levels}/${levelId}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useFetchLevelsQuery } = LevelsApi;
export const { useFetchLevelsByIdQuery } = LevelsDetailsApi;
