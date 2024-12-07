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
  subjects: [];
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
