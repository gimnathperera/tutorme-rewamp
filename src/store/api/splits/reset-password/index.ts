import { ResetPasswordRequest } from "@/types/request-types";
import { ResetPasswordResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    resetPassword: build.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: ({ token, password }) => ({
        url: `${Endpoints.ResetPassword}?token=${token}`,
        method: "POST",
        body: { password },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useResetPasswordMutation } = usersApi;
