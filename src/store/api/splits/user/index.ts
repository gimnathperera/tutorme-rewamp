import { UserRegisterRequest } from "@/types/request-types";
import { UserRegisterResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation<UserRegisterResponse, UserRegisterRequest>({
      query: (payload) => {
        return {
          url: Endpoints.Register,
          method: "POST",
          body: payload,
        };
      },
    }),
  }),

  overrideExisting: false,
});

export const { useRegisterUserMutation } = authApi;
