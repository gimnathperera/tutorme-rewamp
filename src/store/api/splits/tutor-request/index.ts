import { FindMyTutorRequest } from "@/types/request-types";
import {
  FindMyTutorResponse,
  ProfileResponse,
  TutorEmailAvailabilityResponse,
} from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

type TutorRegistrationLookupRequest = {
  userId: string;
  email?: string;
};

type TutorRegistrationLookupResponse =
  | Partial<ProfileResponse>
  | { results?: Partial<ProfileResponse>[]; data?: unknown }
  | null;

export const TutorRequestApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addTutorRequest: build.mutation<FindMyTutorResponse, FindMyTutorRequest>({
      query: (data) => ({
        url: Endpoints.RegisterTutor,
        method: "POST",
        body: data,
      }),
    }),
    getTutorEmailAvailability: build.query<
      TutorEmailAvailabilityResponse,
      string
    >({
      query: (email) => ({
        url: `${Endpoints.RegisterTutorEmailAvailability}?email=${encodeURIComponent(email)}`,
        method: "GET",
      }),
    }),
    getTutorRegistration: build.query<
      TutorRegistrationLookupResponse,
      TutorRegistrationLookupRequest
    >({
      async queryFn({ userId, email }, _api, _extraOptions, baseQuery) {
        const candidateUrls = [
          `${Endpoints.RegisterTutor}/user/${encodeURIComponent(userId)}`,
          `${Endpoints.RegisterTutor}/users/${encodeURIComponent(userId)}`,
          `${Endpoints.RegisterTutor}/${encodeURIComponent(userId)}`,
          email
            ? `${Endpoints.RegisterTutor}?email=${encodeURIComponent(email)}`
            : null,
        ].filter(Boolean) as string[];

        for (const url of candidateUrls) {
          const result = await baseQuery({ url, method: "GET" });

          if (result.data) {
            return { data: result.data as TutorRegistrationLookupResponse };
          }
        }

        return { data: null };
      },
    }),
  }),

  overrideExisting: false,
});

export const {
  useAddTutorRequestMutation,
  useLazyGetTutorRegistrationQuery,
  useLazyGetTutorEmailAvailabilityQuery,
} = TutorRequestApi;
