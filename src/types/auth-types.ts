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

export type Tokens = {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
};
