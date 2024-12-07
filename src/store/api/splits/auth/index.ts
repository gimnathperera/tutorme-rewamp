import {
  UserLoginRequest,
  UserLogoutRequest,
  UserRefreshTokenRequest,
} from "@/types/request-types";
import { TokenResponse, UserLoginResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<UserLoginResponse, UserLoginRequest>({
      query: (payload) => {
        return {
          url: Endpoints.Login,
          method: "POST",
          body: payload,
        };
      },
    }),
    logout: build.mutation<void, UserLogoutRequest>({
      query: (payload) => {
        return {
          url: Endpoints.Logout,
          method: "POST",
          body: payload,
        };
      },
    }),
    fetchAccessToken: build.mutation<TokenResponse, UserRefreshTokenRequest>({
      query: (payload) => {
        return {
          url: Endpoints.RefreshToken,
          method: "POST",
          body: payload,
        };
      },
    }),
  }),

  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useFetchAccessTokenMutation,
} = usersApi;
