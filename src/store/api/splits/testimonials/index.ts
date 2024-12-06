import { FetchTestimonialsRequest } from "@/types/request-types";
import { PaginatedResponse, Testimonial } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const testimonialsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTestimonials: build.query<
      PaginatedResponse<Testimonial>,
      FetchTestimonialsRequest
    >({
      query: (payload) => ({
        url: Endpoints.Testimonials,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Testimonials"],
    }),
  }),
  overrideExisting: false,
});

export const { useFetchTestimonialsQuery } = testimonialsApi;
