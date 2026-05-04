import { FetchBlogsRequest, UpdateBlogRequest } from "@/types/request-types";
import { PaginatedResponse, Blogs } from "@/types/response-types";
import { baseApi } from "../..";
import { Endpoints } from "../../endpoints";
import { CreateArticleSchema } from "@/app/blogs/components/create-blog/schema";
import type { BlogStatus } from "@/configs/options";

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
      providesTags: (result, error, id) => [{ type: "Blogs" as const, id }],
    }),

    /** SEO-friendly lookup: GET /blogs/slug/:slug */
    fetchBlogBySlug: build.query<Blogs, string>({
      query: (slug) => ({
        url: `${Endpoints.Blogs}/slug/${slug}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Blogs" as const, id: result.id }] : ["Blogs"],
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
      invalidatesTags: (result, error, { id }) => [{ type: "Blogs", id }],
    }),

    deleteBlog: build.mutation<void, string>({
      query: (id) => ({
        url: `${Endpoints.Blogs}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),

    updateBlogStatus: build.mutation<
      Blogs,
      { id: string; status: BlogStatus }
    >({
      query: ({ id, status }) => ({
        url: `${Endpoints.Blogs}/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blogs", id },
        "Blogs",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchBlogsQuery,
  useFetchBlogByIdQuery,
  useFetchBlogBySlugQuery,
  useUpdateBlogMutation,
  useLazyFetchBlogByIdQuery,
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogStatusMutation,
} = BlogsApi;
