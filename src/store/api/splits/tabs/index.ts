import { FetchTagsRequest } from "@/types/request-types";
import { PaginatedResponse, Tags } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const TagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTags: build.query<PaginatedResponse<Tags>, FetchTagsRequest>({
      query: (payload) => {
        const { tagId, ...rest } = payload;
        return {
          url: Endpoints.Tags,
          method: "GET",
          params: rest,
        };
      },
      providesTags: ["Tags"],
    }),

    fetchTagById: build.query<Tags, string>({
      query: (id) => ({
        url: `${Endpoints.Tags}/${id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchTagsQuery,
  useFetchTagByIdQuery,
  useLazyFetchTagByIdQuery,
} = TagsApi;
