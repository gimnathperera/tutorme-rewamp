import { UserLoginRequest, ForgotPasswordRequest } from "@/types/request-types";
import {
  MeResponse,
  UserLoginResponse,
  GoogleAuthResponse,
  ForgotPasswordResponse,
} from "@/types/response-types";
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
    logout: build.mutation<void, void>({
      query: () => {
        return {
          url: Endpoints.Logout,
          method: "POST",
        };
      },
    }),
    me: build.query<MeResponse, void>({
      query: () => {
        return {
          url: Endpoints.Me,
          method: "GET",
        };
      },
    }),
    googleAuth: build.mutation<GoogleAuthResponse, { idToken: string }>({
      query: (payload) => {
        return {
          url: Endpoints.GoogleAuth,
          method: "POST",
          body: payload,
        };
      },
    }),
    forgotPassword: build.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (payload) => {
        return {
          url: Endpoints.ForgotPassword,
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
  useLazyMeQuery,
  useGoogleAuthMutation,
  useForgotPasswordMutation,
} = usersApi;
