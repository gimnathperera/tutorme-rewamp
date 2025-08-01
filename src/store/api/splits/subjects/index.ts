import { FetchSubjectsRequest } from "@/types/request-types";
import { PaginatedResponse, Subject } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

// ✅ For all subjects (paginated list)
export const SubjectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchSubjects: build.query<PaginatedResponse<Subject>, FetchSubjectsRequest>({
      query: (payload) => {
        const { subjectId, ...rest } = payload;
        return {
          url: Endpoints.Subjects,
          method: "GET",
          params: rest,
        };
      },
      providesTags: ["Subjects"],
    }),
  }),
  overrideExisting: false,
});

// ✅ For single subject by ID
export const SubjectDetailsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchSubjectById: build.query<Subject, { subjectId: string }>({
      query: ({ subjectId }) => ({
        url: `${Endpoints.Subjects}/${subjectId}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

// ✅ Export both hooks with unique names
export const { useFetchSubjectsQuery } = SubjectsApi;
export const { useFetchSubjectByIdQuery } = SubjectDetailsApi;
