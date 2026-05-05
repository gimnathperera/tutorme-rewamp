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

type TutorRegistrationCandidate = Record<string, any>;

const hasTutorRegistrationFields = (candidate: unknown): boolean => {
  if (!candidate || typeof candidate !== "object") return false;

  const data = candidate as TutorRegistrationCandidate;

  return Boolean(
    data.classType ||
      data.tutoringLevels ||
      data.grades ||
      data.subjects ||
      data.certificatesAndQualifications ||
      data.academicDetails ||
      data.teachingSummary ||
      data.studentResults ||
      data.sellingPoints ||
      data.tutorType ||
      data.tutorTypes ||
      data.tutorMediums ||
      data.highestEducation,
  );
};

const hasTutorRegistrationPayload = (response: unknown): boolean => {
  if (!response || typeof response !== "object") return false;

  if (Array.isArray(response)) {
    return response.some(hasTutorRegistrationFields);
  }

  const data = response as TutorRegistrationCandidate;
  const candidates = [
    data,
    data.tutor,
    data.tutorProfile,
    data.profile,
    data.data,
    data.data?.tutor,
    data.data?.profile,
  ];

  if (candidates.some(hasTutorRegistrationFields)) return true;

  const collections = [data.results, data.data, data.data?.results];

  return collections.some(
    (collection) =>
      Array.isArray(collection) && collection.some(hasTutorRegistrationFields),
  );
};

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

          if (hasTutorRegistrationPayload(result.data)) {
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
