"use client";

import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  CreateArticleSchema,
  createArticleSchema,
} from "@/app/blogs/components/edit-blog/schema";
import {
  useFetchBlogByIdQuery,
  useFetchBlogsQuery,
  useUpdateBlogMutation,
} from "@/store/api/splits/blogs";
import MultiSelect, { Option } from "@/components/MultiSelect";
import { useAuthContext } from "@/contexts";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditBlogPage() {
  const params = useParams();
  const blogId = params?.id as string;
  const router = useRouter();
  const { user } = useAuthContext();

  const { data: blog, isLoading } = useFetchBlogByIdQuery(blogId);
  const { data: blogsData } = useFetchBlogsQuery({});
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [isPreview, setIsPreview] = useState(false);

  const form = useForm<CreateArticleSchema>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: "",
      author: { name: "", avatar: "", role: "" },
      content: [],
      relatedArticles: [],
      status: "pending",
    },
  });

  const { register, handleSubmit, control, reset, watch, formState } = form;

  const blogOptions: Option[] =
    blogsData?.results.map((b) => ({ value: b.id, text: b.title })) || [];
  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  useEffect(() => {
    if (blog && user) {
      reset({
        title: blog.title,
        status: "pending",
        author: {
          name: blog.author.name,
          avatar:
            blog.author.avatar || "https://example.com/default-avatar.png",
          role: blog.author.role,
        },
        relatedArticles: blog.relatedArticles.map((ra) => ra.id),
        content: blog.content.map((c) => ({
          type: c.type,
          text: "text" in c ? decodeHtml(c.text) : "",
          src: "src" in c ? c.src : "",
          caption: "caption" in c ? c.caption : "",
          level: "level" in c ? c.level : 1,
        })),
      });
    }
  }, [blog, user, reset]);

  const onSubmit = async (data: CreateArticleSchema) => {
    try {
      const imageContent = data.content.find((c) => c.type === "image");

      const payload = {
        id: blogId,
        title: data.title,
        author: {
          name: user?.name || data.author.name,
          avatar: user?.avatar || "https://example.com/default-avatar.png",
          role: user?.role || data.author.role,
        },
        image: imageContent?.src || "",
        content: data.content,
        relatedArticles: data.relatedArticles,
        status: "pending",
      };

      const result = await updateBlog(payload);
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);

      toast.success("Blog updated successfully");

      router.push(`/blogs/${blog?.id}`);
      window.location.href = `/blogs/${blogId}`;
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col bg-white m-5 md:flex-row gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
        {/* Edit / Preview toggle */}
        <div className="flex gap-2 mt-6 px-6">
          <Button
            type="button"
            variant={isPreview ? "outline" : "default"}
            onClick={() => setIsPreview(false)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant={isPreview ? "default" : "outline"}
            onClick={() => setIsPreview(true)}
          >
            Preview
          </Button>
        </div>

        {!isPreview ? (
          <div className="p-6 space-y-6">
            {/* Title */}
            <input
              placeholder="Blog Title"
              className="text-[30pt] w-full font-semibold focus:outline-none placeholder-gray-400"
              {...register("title")}
            />
            {formState.errors.title && (
              <p className="text-red-500">{formState.errors.title.message}</p>
            )}

            {/* Related articles */}
            <Controller
              name="relatedArticles"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Related Articles"
                  options={blogOptions}
                  value={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Content */}
            {watch("content").map((c, idx) => {
              if (c.type === "paragraph")
                return (
                  <div key={idx}>
                    <Input
                      type="hidden"
                      value="paragraph"
                      {...register(`content.${idx}.type` as const)}
                    />
                    <Controller
                      name={`content.${idx}.text` as const}
                      control={control}
                      render={({ field }) => (
                        <ReactQuill
                          theme="snow"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Write your paragraph..."
                          className="
                      bg-white rounded-lg
                      [&_.ql-toolbar]:border-0
                      [&_.ql-toolbar]:rounded-t-lg
                      [&_.ql-container]:border-0
                      [&_.ql-container]:rounded-b-lg
                      [&_.ql-editor.ql-blank::before]:text-gray-400
                      [&_.ql-editor.ql-blank::before]:italic
                    "
                        />
                      )}
                    />
                    {formState.errors.content?.[idx]?.text && (
                      <p className="text-red-500">
                        {formState.errors.content[idx]?.text?.message}
                      </p>
                    )}
                  </div>
                );
              if (c.type === "heading")
                return (
                  <div key={idx}>
                    <Input
                      type="hidden"
                      value="heading"
                      {...register(`content.${idx}.type` as const)}
                    />
                    <Input
                      type="hidden"
                      value={c.level}
                      {...register(`content.${idx}.level` as const)}
                    />
                    <Input
                      placeholder="Heading text"
                      className="border rounded-md"
                      {...register(`content.${idx}.text` as const)}
                    />
                    {formState.errors.content?.[idx]?.text && (
                      <p className="text-red-500">
                        {formState.errors.content[idx]?.text?.message}
                      </p>
                    )}
                  </div>
                );
              if (c.type === "image")
                return (
                  <div key={idx}>
                    <Input
                      type="hidden"
                      value="image"
                      {...register(`content.${idx}.type` as const)}
                    />
                    <Input
                      placeholder="Image URL"
                      className="border rounded-md"
                      {...register(`content.${idx}.src` as const)}
                    />
                    <Input
                      placeholder="Caption"
                      className="border rounded-md mt-1"
                      {...register(`content.${idx}.caption` as const)}
                    />
                    {formState.errors.content?.[idx]?.src && (
                      <p className="text-red-500">
                        {formState.errors.content[idx]?.src?.message}
                      </p>
                    )}
                  </div>
                );
              return null;
            })}

            <input type="hidden" value="pending" {...register("status")} />
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none mt-6 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
            <h1 className="flex justify-center items-center text-3xl font-semibold mb-5">
              {watch("title") || "No title yet"}
            </h1>
            {watch("content.1.text") && (
              <h2 className="text-xl font-medium mb-5">
                {watch("content.1.text")}
              </h2>
            )}
            <p className="text-justify">
              <div
                className="prose dark:prose-invert max-w-none text-justify"
                dangerouslySetInnerHTML={{
                  __html: decodeHtml(
                    watch("content.0.text") ||
                      "<p>Nothing to preview yet...</p>"
                  ),
                }}
              />
            </p>

            {watch("content.2.src") && (
              <figure>
                <img
                  className="mt-5 h-[400px]"
                  src={watch("content.2.src")}
                  alt={watch("content.2.caption") || "Image"}
                />
                {watch("content.2.caption") && (
                  <figcaption>{watch("content.2.caption")}</figcaption>
                )}
              </figure>
            )}
          </div>
        )}

        <div className="flex justify-end items-end mt-8 px-6 mb-4">
          <Button
            type="submit"
            className="bg-blue-700 text-white hover:bg-blue-500"
            isLoading={isUpdating}
          >
            Update Blog
          </Button>
        </div>
      </form>
    </div>
  );
}
