import { env } from "@/configs/env";
import { shouldRefreshTokenBeReFetched } from "@/utils/auth";
import { CustomAppEvent, triggerCustomAppEvent } from "@/utils/custom-events";
import {
  LocalStorageKey,
  getLocalStorageItem,
  removeLocalStorageItem,
} from "@/utils/local-storage";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react";
import { debounce } from "lodash-es";

let accessToken: string | null = null;

const endpointsURLsToAvoidRetry = ["/v1/admin/auth/token"];

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: env.urls.apiUrl,

    prepareHeaders: (headers, api) => {
      checkIfRefreshTokenToBeFetched(api.endpoint);

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),
  {
    retryCondition: (
      error: FetchBaseQueryError | any,
      baseQueryArgs,
      { attempt }
    ) => {
      if (endpointsURLsToAvoidRetry.includes(baseQueryArgs.url)) return false;
      if (attempt > 5) return false;

      if (error.status === "TIMEOUT_ERROR" || error.status === "FETCH_ERROR")
        return true;
      if (typeof error.status !== "number") return false;

      return error.status === 429 || error.status > 500;
    },
  }
);

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await staggeredBaseQuery(args, api, extraOptions);

  if (
    result.error &&
    (result.error.status === 401 ||
      (result.error.status === 403 &&
        (result.error.data as { message: string } | undefined)?.message ===
          "Invalid token."))
  ) {
    removeLocalStorageItem(LocalStorageKey.USER_DATA);
    removeLocalStorageItem(LocalStorageKey.ACCESS_TOKEN);
    removeLocalStorageItem(LocalStorageKey.REFRESH_TOKEN);

    window.sessionStorage.clear();
    setApiAccessToken(null);
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: ["Faqs", "Testimonials", "Grades", "Subjects", "Papers"],
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});

export const setApiAccessToken = (token: string | null): void => {
  accessToken = token;
};

if (typeof window !== "undefined") {
  const storedToken = getLocalStorageItem<string>(
    LocalStorageKey.ACCESS_TOKEN
  )!;

  setApiAccessToken(storedToken);
}

const checkIfRefreshTokenToBeFetched = debounce(
  (endpoint: string): void => {
    if (typeof window === "undefined") return;
    if (endpoint === "getRefreshToken") return;

    if (shouldRefreshTokenBeReFetched()) {
      triggerCustomAppEvent(CustomAppEvent.TriggerRefreshToken);
    }
  },
  2000,
  { leading: false, trailing: true }
);
