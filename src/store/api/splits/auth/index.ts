import { AuthTokenParams } from "@/types/auth-types";

import { AuthTokensResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuthTokens: build.mutation<AuthTokensResponse[], AuthTokenParams>({
      query: (payload) => {
        return {
          url: Endpoints.AuthTokens,
          method: "POST",
          body: payload,
        };
      },
    }),

    getRefreshToken: build.mutation<AuthTokensResponse, string>({
      query: (refreshToken) => ({
        url: Endpoints.RefreshToken,
        method: "POST",
        body: { refreshToken },
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useGetAuthTokensMutation, useGetRefreshTokenMutation } = authApi;
