import { FindMyTutorResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";
import { FindMyTutorForm } from "@/app/register-tutor/schema";
import { FindMyTutorRequest } from "@/types/request-types";

export const TutorRequestApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addTutorRequest: build.mutation<
      FindMyTutorResponse,
      FindMyTutorForm | FindMyTutorRequest
    >({
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
