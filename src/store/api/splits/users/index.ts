import {
  FetchProfileRequest,
  UserRegisterRequest,
} from "@/types/request-types";
import { ProfileResponse, UserRegisterResponse } from "@/types/response-types";
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
  }),

  overrideExisting: false,
});

export const { useRegisterUserMutation, useLazyGetProfileQuery } = usersApi;
