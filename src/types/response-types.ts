import { AuthTokens } from "./auth-types";

export type AuthTokensResponse = AuthTokens;

export type Faq = {
  answer: string;
  question: string;
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type Testimonial = {
  content: string;
  rating: number;
  owner: {
    name: string;
    role: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  id: string;
};

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

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}
