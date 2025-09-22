import {
  FetchBlogsRequest,
  FetchTuitionRatesRequest,
  UpdateBlogRequest,
} from "@/types/request-types";
import { PaginatedResponse, Blogs } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";
import { CreateArticleSchema } from "@/app/blogs/components/create-blog/schema";

export const BlogsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchBlogs: build.query<PaginatedResponse<Blogs>, FetchBlogsRequest>({
      query: (payload) => {
        const { blogId, ...rest } = payload;
        return {
          url: Endpoints.Blogs,
          method: "GET",
          params: rest,
        };
      },
      providesTags: ["Blogs"],
    }),

    fetchBlogById: build.query<Blogs, string>({
      query: (id) => ({
        url: `${Endpoints.Blogs}/${id}`,
        method: "GET",
      }),
    }),

    createBlog: build.mutation<Blogs, CreateArticleSchema>({
      query: (payload) => ({
        url: Endpoints.Blogs,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Blogs"],
    }),

    updateBlog: build.mutation<Blogs, UpdateBlogRequest>({
      query: ({ id, ...payload }) => ({
        url: `${Endpoints.Blogs}/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Blogs"],
    }),

    deleteBlog: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.Blogs}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchBlogsQuery,
  useFetchBlogByIdQuery,
  useUpdateBlogMutation,
  useLazyFetchBlogByIdQuery,
  useCreateBlogMutation,
  useDeleteBlogMutation,
} = BlogsApi;
