import { AuthTokens } from "./auth-types";

type Response<T> = {
  data: T;
  success: boolean;
};

export type AuthTokensResponse = AuthTokens;

export type ContactUsResponse = Response<string>;
