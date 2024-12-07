import { Grade, Subject } from "./response-types";

export type ContactUsRequest = {
  message: string;
  sender: {
    name: string;
    email: string;
  };
};

export type UserLoginRequest = {
  email: string;
  password: string;
};

export type UserRefreshTokenRequest = {
  refreshToken: string;
};

export type UserLogoutRequest = {
  refreshToken: string;
};

export type UserRegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type UpdateProfileRequest = {
  id: string;
  payload: {
    name: string;
    email: string;
    grade?: string;
    subjects?: string[];
    country?: string;
    phoneNumber?: string;
    city?: string;
    state?: string;
    region?: string;
    zip?: string;
    address?: string;
    birthday?: string;
    tutorType?: string;
    gender?: "Male" | "Female" | "None";
    duration?: string;
  };
};

export type FetchProfileRequest = {
  userId: string;
};

export type FetchFaqRequest = {
  page: number;
  limit: number;
};

export type FetchPapersRequest = {
  page: number;
  limit: number;
  grade: string;
  subject: string;
};

export type FetchGradesRequest = {
  page: number;
  limit: number;
};

export type FetchSubjectsRequest = {
  page: number;
  limit: number;
  gradeId: string;
};

export type FetchTestimonialsRequest = {
  page: number;
  limit: number;
};
