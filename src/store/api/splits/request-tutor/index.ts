/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateRequestTutorSchema } from "../../../../app/request-for-tutors/create-request/schema";
import { RequestTutors } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const RequestTutorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTutorRequests: build.mutation<
      RequestTutors,
      CreateRequestTutorSchema
    >({
      query: (payload) => {
        return {
          url: Endpoints.RequestTutors,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["RequestTutors"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateTutorRequestsMutation } = RequestTutorApi;
