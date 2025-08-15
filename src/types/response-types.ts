export type Id = { id: string };
export type Timestamp = { createdAt: string; updatedAt: string };

export type BaseEntity = Id & Timestamp;

export type WithTitleDescription = {
  title: string;
  description: string;
};

// Reusable response wrapper
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  totalResults: number;
};

// FAQ
export type Faq = BaseEntity & {
  question: string;
  answer: string;
};

export type Level = {
  createdAt: string;
  updatedAt: string;
  id: string;
  details: string[];
  challanges: string[];
  subjects: Subject[];
  title: string;
};

export type TuitionRateItem = {
  _id: string;
  title: string;
  grade: Grade;
  subject: Subject;
  level: Level;
  govTuitionRate: Rate[];
  partTimeTuitionRate: Rate[];
  fullTimeTuitionRate: Rate[];
};
export type Rate = {
  minimumRate: string;
  maximumRate: string;
};
export type TuitionRateGroup = {
  grade: any;
  subjects: any;
  _id: string;
  level: Level;
  items: TuitionRateItem[];
};
// Subject
export type Subject = BaseEntity & WithTitleDescription;

// Grade
export type Grade = BaseEntity &
  WithTitleDescription & {
    subjects: Subject[];
  };

// Paper
export type Paper = BaseEntity &
  WithTitleDescription & {
    file: string;
    grade: Grade;
    subject: Subject;
    year: string;
    url: string;
  };

// Testimonial
export type Testimonial = BaseEntity & {
  content: string;
  rating: number;
  owner: {
    name: string;
    role: string;
    avatar: string;
  };
};

export type ContactUsResponse = {
  message: string;
  sender: {
    name: string;
    email: string;
  };
} & Id &
  Timestamp;

export type UserBase = {
  role: string;
  status: string;
  isEmailVerified: boolean;
  grades: [];
  subjects: [];
  name: string;
  email: string;
} & Id &
  Timestamp;

export type UserRegisterResponse = {
  user: Omit<UserBase, "role" | "status" | "isEmailVerified"> & {
    role: "admin";
    status: "active";
    isEmailVerified: false;
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
  user: UserBase;
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

export type TuitionAssignment = {
  title: string;
  assignmentNumber: string;
  address: string;
  duration: string;
  gradeId: string;
  tutorId: string;
  assignmentPrice: string;
  __v: number;
  gradeName: string;
  tutorName: string;
  tutorType: string;
} & Id &
  Timestamp;

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
  timeZone: string;
  language: string;
} & Id &
  Timestamp;

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
} & Id &
  Timestamp;

export type FaqResponse = PaginatedResponse<Faq>;
export type SubjectResponse = PaginatedResponse<Subject>;
export type GradeResponse = PaginatedResponse<Grade>;
export type PaperResponse = PaginatedResponse<Paper>;
export type TestimonialResponse = PaginatedResponse<Testimonial>;
export type TuitionAssignmentResponse = PaginatedResponse<TuitionAssignment>;
