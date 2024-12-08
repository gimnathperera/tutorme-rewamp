import {
  FetchProfileRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  UserRegisterRequest,
} from "@/types/request-types";
import {
  ProfileResponse,
  UpdatePasswordResponse,
  UserRegisterResponse,
} from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const usersApi = baseApi.injectEndpoints({
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
    getProfile: build.query<ProfileResponse, FetchProfileRequest>({
      query: ({ userId }) => {
        // TODO: the api endpoint will be changed to a more secure and proper one [/profile/me]
        return {
          url: `${Endpoints.Users}/${userId}`,
          method: "GET",
        };
      },
    }),
    updateProfile: build.mutation<ProfileResponse, UpdateProfileRequest>({
      query: ({ id, payload }) => {
        return {
          url: `${Endpoints.Users}/${id}`,
          method: "PATCH",
          body: payload,
        };
      },
    }),
    updateUserPassword: build.mutation<
      UpdatePasswordResponse,
      UpdatePasswordRequest
    >({
      query: ({ id, payload }) => {
        return {
          url: `${Endpoints.ChangePassword}/${id}`,
          method: "PATCH",
          body: payload,
        };
      },
    }),
  }),

  overrideExisting: false,
});

export const {
  useRegisterUserMutation,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateUserPasswordMutation,
} = usersApi;
