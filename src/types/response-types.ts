import { AuthTokens } from "./auth-types";

type Response<T> = {
  data: T;
  success: boolean;
};

export type AuthTokensResponse = AuthTokens;

export type ContactUsResponse = {
  message: string;
  sender: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type UserRegisterResponse = {
  user: {
    role: "admin";
    status: "active";
    isEmailVerified: false;
    grades: [];
    subjects: [];
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
};
