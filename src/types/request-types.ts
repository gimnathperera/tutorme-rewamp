export type ContactUsRequest = {
  message: string;
  sender: {
    name: string;
    email: string;
  };
};

export type UserRegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type FetchFaqRequest = {
  page: number;
  limit: number;
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
