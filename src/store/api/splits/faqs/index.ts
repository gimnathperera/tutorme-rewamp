import { FetchFaqRequest } from "@/types/request-types";
import { Faq, PaginatedResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const FaqsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchFaqs: build.query<PaginatedResponse<Faq>, FetchFaqRequest>({
      query: (payload) => ({
        url: Endpoints.Faqs,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Faqs"],
    }),
  }),
  overrideExisting: false,
});

export const { useFetchFaqsQuery } = FaqsApi;
