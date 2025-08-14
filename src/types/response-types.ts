// Shared base types
export type CommonTypes = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

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
};

// FAQ
export type Faq = CommonTypes & {
  question: string;
  answer: string;
};

// Subject
export type Subject = CommonTypes & WithTitleDescription;

// Grade
export type Grade = CommonTypes & WithTitleDescription & {
  subjects: Subject[];
};

// Paper
export type Paper = CommonTypes & WithTitleDescription & {
  file: string;
  grade: Grade;
  subject: Subject;
};

// Testimonial
export type Testimonial = CommonTypes & {
  studentName: string;
  comment: string;
};

export type ContactUsResponse = CommonTypes & {
  message: string;
  sender: {
    name: string;
    email: string;
  };
};

export type UserRegisterResponse = {
  user: CommonTypes & {
    role: "admin";
    status: "active";
    isEmailVerified: false;
    grades: [];
    subjects: [];
    name: string;
    email: string;
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
  user: CommonTypes & {
    role: string;
    status: string;
    isEmailVerified: boolean;
    grades: [];
    subjects: [];
    name: string;
    email: string;
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

export type TuitionAssignment = CommonTypes & {
  title: string,
  assignmentNumber: string,
  address: string,
  duration: string,
  gradeId: string,
  tutorId: string,
  assignmentPrice: string,
  __v: number,
  gradeName: string,
  tutorName: string,
  tutorType: string
}

export type ProfileResponse = CommonTypes & {
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

export type FindMyTutorResponse = CommonTypes & {
  status: string;
  personalInfo: PersonalInfo;
  lessonInfo: LessonInfo;
  tutorTypeInfo: TutorTypeInfo;
};

export type FaqResponse = PaginatedResponse<Faq>;
export type SubjectResponse = PaginatedResponse<Subject>;
export type GradeResponse = PaginatedResponse<Grade>;
export type PaperResponse = PaginatedResponse<Paper>;
export type TestimonialResponse = PaginatedResponse<Testimonial>;
export type TuitionAssignmentResponse = PaginatedResponse<TuitionAssignment>;