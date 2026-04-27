import { FindMyTutorRequest } from "@/types/request-types";
import {
  FindMyTutorResponse,
  TutorEmailAvailabilityResponse,
} from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const TutorRequestApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addTutorRequest: build.mutation<FindMyTutorResponse, FindMyTutorRequest>({
      query: (data) => ({
        url: Endpoints.RegisterTutor,
        method: "POST",
        body: data,
      }),
    }),
    getTutorEmailAvailability: build.query<
      TutorEmailAvailabilityResponse,
      string
    >({
      query: (email) => ({
        url: `${Endpoints.RegisterTutorEmailAvailability}?email=${encodeURIComponent(email)}`,
        method: "GET",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useAddTutorRequestMutation,
  useLazyGetTutorEmailAvailabilityQuery,
} = TutorRequestApi;
