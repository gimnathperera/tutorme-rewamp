import { Level } from "./response-types";

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
    name?: string;
    email?: string;
    grade?: string;
    subjects?: string[];
    country?: string;
    phoneNumber?: string;
    city?: string;
    state?: string;
    region?: string;
    zip?: string;
    address?: string;
    birthday?: string | Date;
    tutorType?: string;
    gender?: string;
    duration?: string;
    timeZone?: string;
    language?: string;
  };
};

export type UpdatePasswordRequest = {
  id: string;
  payload: {
    currentPassword: string;
    newPassword: string;
  };
};

export type FetchProfileRequest = {
  userId: string;
};

export type FetchFaqRequest = {
  page: number;
  limit: number;
};
export type FetchLevelRequest = {
  page: number;
  limit: number;
  title: string;
  details: string[];
  challenges?: string[];
  subjects: string[];
  levelId: string;
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
export type FetchTuitionRatesRequest ={
  tuitionRateId?: string;
  title?: string;
  tutorType?: string;
  subject?: string;
  grade?: string;
  maximumRate?: string;
  minimumRate?: string;
  page?: number;
  limit?: number;
};
export type FetchSubjectsRequest = {
  title?: string;
  description?:string;
  page?: number;
  limit?: number;
  subjectId?: string;
};

export type FetchTestimonialsRequest = {
  page: number;
  limit: number;
};

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  zip: string;
  region: string;
  grade: string;
};

type LessonDetail = {
  subjects: string[];
  duration: string;
  frequency: string;
};

type LessonInfo = {
  tutorCount: string;
  lessonDetails: LessonDetail[];
};

type TutorTypeInfo = {
  tutorType: string;
  studentSchool: string;
  genderPreference: string;
  isBilingualTutor: boolean;
};

export type FindMyTutorRequest = {
  personalInfo: PersonalInfo;
  lessonInfo: LessonInfo;
  tutorTypeInfo: TutorTypeInfo;
};
