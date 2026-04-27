export type Id = { id: string };
export type Timestamp = { createdAt: string; updatedAt: string };

export type BaseEntity = Id & Timestamp;

export type WithTitleDescription = {
  title: string;
  description: string;
};

// Reusable response wrapper
export type PaginatedResponse<T> = {
  [x: string]: any;
  relatedArticles: any;
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  tags: T[];
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

export type Rate = {
  minimumRate: string | number;
  maximumRate: string | number;
};

export type TuitionRateItem = {
  _id: string;
  title: string;
  grade: Grade;
  subject: Subject;
  universityStudentsRate: Rate;
  partTimeTutorRate: Rate;
  fullTimeTutorRate: Rate;
  moeTeacherRate: Rate;
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

//request tutor
export type RequestTutors = BaseEntity & {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  region: string;
  zip: string;
  studentSchool: string;
  preferredTutorType: string;
  genderPreference: string;
  bilingual: string;

  grade: {
    id: string;
    title: string;
    description: string;
    subjects: string[];
    createdAt: string;
    updatedAt: string;
  }[];

  tutors: {
    subjects: {
      id: string;
      title: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    }[];
    duration: string;
    frequency: string;
  }[];

  createdAt: string;
  updatedAt: string;
};
// Grade
export type Grade = BaseEntity &
  WithTitleDescription & {
    subjects: Subject[];
  };

type PaperMedium =
  | string
  | {
      id?: string;
      title?: string;
      name?: string;
      label?: string;
      text?: string;
      value?: string;
    };

// Paper
export type Paper = BaseEntity &
  WithTitleDescription & {
    file: string;
    grade: Grade;
    subject: Subject;
    year: string;
    url: string;
    medium?: PaperMedium;
    language?: PaperMedium;
    languages?: PaperMedium[];
    mediums?: PaperMedium[];
  };

export type Blogs = BaseEntity &
  WithTitleDescription & {
    _id: string;
    id: string;
    title: string;
    /** SEO-friendly slug, e.g. "the-business-value-of-software-qa" */
    slug?: string;
    image: string;
    type: string;
    status: "pending" | "approved" | "rejected";
    author: {
      /** MongoDB ObjectId of the user who created the blog */
      id: string;
      role: "admin" | "tutor";
    };
    relatedArticles: Array<{
      id: string;
      slug?: string;
      title: string;
      image: string;
      author?: {
        id: string;
        role: "admin" | "tutor";
      };
    }>;
    tags: Array<{
      id: string;
      name: string;
    }>;
    content: Array<
      | { type: "paragraph"; text: string }
      | { type: "heading"; text: string; level: number }
      | { type: "image"; src: string; caption?: string }
      | { type: "table"; headers: string[]; rows: string[][] }
      | { type: "quote"; text: string; citation?: string }
      | { type: "list"; items: string[]; style: "ordered" | "unordered" }
      | { type: "embed"; src?: string; html?: string }
    >;
    faqs: Array<{
      _id: string;
      question: string;
      answer: string;
    }>;
    createdAt: string;
    updatedAt: string;
    name: string;
  };

export type Tags = BaseEntity &
  WithTitleDescription & {
    _id: string;
    name: string;
    tags: string[];
    description: string;
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
export type ForgotPasswordResponse = {
  success: boolean;
  message: string;
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
  fullName?: string;
  email: string;
  country: string;
  phoneNumber: string;
  contactNumber?: string;
  city: string;
  state: string;
  region: string;
  zip: string;
  address: string;
  birthday: string;
  dateOfBirth?: string;
  tutorType: string | string[];
  gender: "Male" | "Female" | "Others" | "None";
  age?: number;
  nationality?: string;
  race?: string;
  duration: string;
  frequency: string;
  timeZone: string;
  language: string;
  availability?: string;
  rate?: string;
  avatar?: string;
  tutoringLevels?: string[];
  preferredLocations?: string[];
  tutorTypes?: string[];
  highestEducation?: string;
  yearsExperience?: number;
  tutorMediums?: string[];
  academicDetails?: string;
  certificatesAndQualifications?: string[];
} & Id &
  Timestamp;

export type UpdatePasswordResponse = {
  message: string;
};
export type ResetPasswordResponse = {
  message: string;
  success: boolean;
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
