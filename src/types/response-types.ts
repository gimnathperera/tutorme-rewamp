export type Faq = {
  answer: string;
  question: string;
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type Subject = {
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type Grade = {
  subjects: Subject[];
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type Paper = {
  title: string;
  description: string;
  subject: Subject;
  grade: Grade;
  year: string;
  url: string;
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

export type UserLoginResponse = {
  user: {
    role: string;
    status: string;
    isEmailVerified: boolean;
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

export type ProfileResponse = {
  role: string;
  status: string;
  isEmailVerified: boolean;
  grades: Grade[];
  subjects: Subject[];
  name: string;
  email: string;
  country: string;
  phoneNumber: string;
  city: string;
  state: string;
  region: string;
  zip: string;
  address: string;
  birthday: string;
  tutorType: string;
  gender: "Male" | "Female" | "None";
  duration: string;
  frequency: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  timeZone: string;
  language: string;
};

export type UpdatePasswordResponse = {
  message: string;
};

export type TokenResponse = {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
};

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

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
  isBilingualTutor: boolean;
  tutorType: string;
  studentSchool: string;
  genderPreference: string;
};

export type FindMyTutorResponse = {
  status: string;
  personalInfo: PersonalInfo;
  lessonInfo: LessonInfo;
  tutorTypeInfo: TutorTypeInfo;
  createdAt: string;
  updatedAt: string;
  id: string;
};
