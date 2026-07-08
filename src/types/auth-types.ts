/* eslint-disable unused-imports/no-unused-vars */

export type AuthTokenParams = {
  code: string;
  codeVerifier?: string;
};

export type ErrorCallback = (err: { [key: string]: string }) => void;

export type AuthUserData = {
  id: number | string;
  role: string;
  email: string;
  name: string;
  avatar?: string;
  status: string;
};
