import { FindMyTutorRequest } from "@/types/request-types";
import { FindMyTutorResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const TutorRequestApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addTutorRequest: build.mutation<FindMyTutorResponse, FindMyTutorRequest>({
      query: (data) => ({
        url: Endpoints.FindATutor,
        method: "POST",
        body: data,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useAddTutorRequestMutation } = TutorRequestApi;
