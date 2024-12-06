import { ContactUsRequest } from "@/types/request-types";
import { ContactUsResponse } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";

export const contactUsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    contactUs: build.mutation<ContactUsResponse, ContactUsRequest>({
      query: (data) => ({
        url: Endpoints.ContactUs,
        method: "POST",
        body: data,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useContactUsMutation } = contactUsApi;
