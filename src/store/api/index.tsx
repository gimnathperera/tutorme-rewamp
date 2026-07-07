import { env } from "@/configs/env";
import { handleForceLogout } from "@/utils/auth";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react";
import { Endpoints } from "./endpoints";

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: env.urls.apiUrl,
    credentials: "include",
  }),
  {
    retryCondition: (
      error: FetchBaseQueryError | any,
      baseQueryArgs,
      { attempt },
    ) => {
      if (attempt > 5) return false;

      return (
        error.status === "TIMEOUT_ERROR" ||
        error.status === "FETCH_ERROR" ||
        (typeof error.status === "number" &&
          (error.status === 429 || error.status > 500))
      );
    },
  },
);

const baseQueryWithAuth: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await staggeredBaseQuery(args, api, extraOptions);

  const requestUrl = typeof args?.url === "string" ? args.url : "";
  const isAuthBootstrapOrLogin =
    requestUrl === Endpoints.Login || requestUrl === Endpoints.Me;

  if (result.error?.status === 401 && !isAuthBootstrapOrLogin) {
    console.log("Session expired or invalid. Forcing logout.");
    handleForceLogout();
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: [
    "Faqs",
    "ForgotPassword",
    "ResetPassword",
    "RequestTutors",
    "Tags",
    "Testimonials",
    "Blogs",
    "Grades",
    "Subjects",
    "Papers",
    "TuitionRates",
    "LevelAndExams",
    "TuitionAssignments",
  ],
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});
