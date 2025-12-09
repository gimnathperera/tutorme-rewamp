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
export type UpdateBlogRequest = {
  id: string;
  blogId: string;
  faqs: string[];
  tags: string[];
  name: string;
  avatar: string;
  role: string;
  image?: string;
  relatedArticles: string[];
  status?: "pending" | "approved" | "rejected";
  authorName?: string;
  title?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

export type FetchBlogsRequest = {
  blogId?: string;
  faqs?: string[];
  image?: string;
  name?: string;
  id?: string;
  tags?: string;
  status?: "pending" | "published" | "draft";
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
export type FetchTuitionAssignmentsRequest = {
  page?: number;
  limit?: number;
  gradeId?: string;
  subjectId?: string;
};

export type FindMyTutorRequest = {
  fullName: string;
  contactNumber: string;

  email: string;
  dateOfBirth: string; 
  gender: string;
  age: number;
  nationality: string;
  race: string;
  last4NRIC: string;
  tutoringLevels: string[]; 
  preferredLocations: string[]; 
  tutorType: string; 
  yearsExperience: number;
  highestEducation: string;
  academicDetails: string;
  teachingSummary: string;
  studentResults: string;
  sellingPoints: string;
  agreeTerms: boolean;
  agreeAssignmentInfo: boolean;
};
export type FetchTutorRequests = {};
