export type AuthTokenParams = {
  code: string;
  codeVerifier?: string;
};

export type ErrorCallback = (err: { [key: string]: string }) => void;

export type AuthUserData = {
  id: number;
  role: string;
  email?: string;
  fullName?: string;
  username?: string;
  avatar?: string;
  iat: number;
  exp: number;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
