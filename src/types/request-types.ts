import { Blogs } from "./response-types";
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

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  password: string;
  token: string;
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
    fullName?: string;
    email?: string;
    grade?: string;
    subjects?: string[];
    country?: string;
    phoneNumber?: string;
    contactNumber?: string;
    city?: string;
    state?: string;
    region?: string;
    zip?: string;
    address?: string;
    birthday?: string | Date;
    dateOfBirth?: string | Date;
    age?: number;
    tutorType?: string | string[];
    gender?: string;
    nationality?: string;
    race?: string;
    duration?: string;
    frequency?: string;
    timeZone?: string;
    language?: string;
    availability?: string;
    rate?: string;
    grades?: string[];
    tutoringLevels?: string[];
    preferredLocations?: string[];
    tutorTypes?: string[];
    highestEducation?: string;
    yearsExperience?: number;
    tutorMediums?: string[];
    academicDetails?: string;
    certificatesAndQualifications?: string[];
    avatar?: string;
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
  grade?: string;
  subject?: string;
  medium?: string;
};

export type FetchGradesRequest = {
  page: number;
  limit: number;
};
export type FetchTuitionRatesRequest = {
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

export type TuitionRateBandRequest = {
  minimumRate: number;
  maximumRate: number;
};
export type UpdateBlogRequest = {
  id: string;
  blogId: string;
  title?: string;
  image?: string;
  content?: Blogs["content"];
  faqs?: Array<{ _id?: string; question: string; answer: string }>;
  tags?: string[];
  relatedArticles?: string[];
  status?: "pending" | "approved" | "rejected";
};

export type FetchBlogsRequest = {
  blogId?: string;
  id?: string;
  status?: "pending" | "approved" | "rejected";
  authorName?: string;
  title?: string;
  page?: number;
  limit?: number;
};

export type FetchTagsRequest = {
  tagId?: string;
  name?: string;
  description?: string;
  page?: number;
  limit?: number;
};

export type FetchSubjectsRequest = {
  title?: string;
  description?: string;
  page?: number;
  limit?: number;
  subjectId?: string;
};

export type FetchTestimonialsRequest = {
  page: number;
  limit: number;
};

export type FetchTuitionAssignments = {
  page?: number;
  limit?: number;
  title?: string;
  assignmentNumber?: string;
  gradeId?: string;
  tutorId?: string;
};

export type FetchTuitionAssignmentsRequest = {
  page?: number;
  limit?: number;
  gradeId?: string;
  subjectId?: string;
};

export type FindMyTutorRequest = {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  nationality: string;
  race: string;

  classType: string[];
  preferredLocations: string[];

  tutorType: string[];
  tutorMediums: string[];
  highestEducation: string;
  grades: string[];
  subjects: string[];
  yearsExperience: number;

  teachingSummary: string;
  studentResults: string;
  sellingPoints: string;
  academicDetails: string;

  certificatesAndQualifications: { type: string; url: string }[];
  agreeTerms: boolean;
  agreeAssignmentInfo: boolean;
};

export type FetchTutorRequests = {};
