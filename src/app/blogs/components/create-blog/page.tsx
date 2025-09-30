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
  initialFormValues,
} from "./schema";
import {
  useCreateBlogMutation,
  useFetchBlogsQuery,
} from "@/store/api/splits/blogs";
import MultiSelect, { Option } from "@/components/MultiSelect";
import { useAuthContext } from "@/contexts";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";

const AddBlog = () => {
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const { data: blogsData } = useFetchBlogsQuery({});
  const { user } = useAuthContext();
  const [isPreview, setIsPreview] = useState(false);

  const createBlogForm = useForm<CreateArticleSchema>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });
  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const { formState, watch, control, reset, register, handleSubmit } =
    createBlogForm;

  const redirect = useRouter();

  useEffect(() => {
    if (user) {
      reset({
        ...initialFormValues,
        author: {
          name: user.name,
          avatar: user.avatar || "https://example.com/default-avatar.png",
          role: user.role,
        },
      });
    }
  }, [user, reset]);

  const blogOptions: Option[] =
    blogsData?.results.map((blog) => ({
      value: blog.id,
      text: blog.title,
    })) || [];

  const onSubmit = async (data: CreateArticleSchema) => {
    if (!user) {
      toast.error("Please authenticate");
      return;
    }
    const imageContent = data.content.find((c) => c.type === "image");
    const payload = {
      ...data,
      author: {
        name: user?.name || data.author.name,
        avatar: user?.avatar || "https://example.com/default-avatar.png",
        role: user?.role || data.author.role,
      },
      image: imageContent?.src || "",
      content: data.content.map((c) =>
        c.type === "image" ? { type: c.type, src: c.src } : c
      ),
    };

    try {
      const result = await createBlog(payload);
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);
      if ("data" in result) onRegisterSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error while creating the blog");
    }
  };

  const onRegisterSuccess = () => {
    reset(initialFormValues);
    toast.success("Blog created successfully");
    redirect.push("/blogs");
  };
  const onClear = () => {
    reset(initialFormValues);
  };
  return (
    <div className="flex flex-col bg-white m-5 md:flex-row gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
        {/* Adding the preview and edit buttons */}
        <div className="flex gap-2 mt-6 px-6">
          <Button
            type="button"
            className="border bg-gray-200"
            variant={isPreview ? "outline" : "default"}
            onClick={() => setIsPreview(false)}
          >
            Edit
          </Button>
          <Button
            type="button"
            className="bg-black text-white"
            variant={isPreview ? "default" : "outline"}
            onClick={() => setIsPreview(true)}
          >
            Preview
          </Button>
        </div>

        {!isPreview ? (
          <div className="p-6 space-y-6">
            <input
              id="title"
              placeholder="Add new blog title here..."
              className="text-[30pt] h-20 w-full font-semibold focus:outline-none placeholder-gray-400"
              {...register("title")}
            />
            {formState.errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {formState.errors.title.message}
              </p>
            )}

            <div className="shadow-sm ">
              <div>
                <Input
                  type="hidden"
                  value="paragraph"
                  {...register("content.0.type")}
                />
                <Controller
                  name="content.0.text"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Write your post content here..."
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
                {formState.errors.content?.[0]?.text && (
                  <p className="text-sm text-red-500">
                    {formState.errors.content[0]?.text?.message}
                  </p>
                )}
              </div>

              <div className="mb-2">
                <Input
                  type="hidden"
                  value="heading"
                  {...register("content.1.type")}
                />
                <Input
                  type="hidden"
                  value="2"
                  {...register("content.1.level", { valueAsNumber: true })}
                />
                <Input
                  id="content.1.text"
                  placeholder="Add Blog Sub Title"
                  className="mt-2 border-none rounded-md"
                  {...register("content.1.text")}
                />
                {formState.errors.content?.[1]?.text && (
                  <p className="text-sm text-red-500">
                    {formState.errors.content[1]?.text?.message}
                  </p>
                )}
              </div>

              <div className="">
                <Input
                  type="hidden"
                  value="image"
                  className="border-none"
                  {...register("content.2.type")}
                />
                <Input
                  id="content.2.src"
                  placeholder="Add Cover Image Url"
                  className="border-none rounded-md"
                  {...register("content.2.src")}
                />
                {formState.errors.content?.[2]?.src && (
                  <p className="text-sm text-red-500">
                    {formState.errors.content[2]?.src?.message}
                  </p>
                )}
                <Input
                  type="hidden"
                  value="Cover Image"
                  {...register("content.2.caption")}
                />
              </div>
            </div>
            <div className="text-gray-500 border-none rounded-lg">
              <Label className="mx-1">Related Articles</Label>
              <Controller
                name="relatedArticles"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={blogOptions}
                    defaultSelected={field.value || []}
                    onChange={field.onChange}
                    value={field.value || []}
                  />
                )}
              />
            </div>
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

            <div className="flex justify-center items-center ">
              {watch("content.2.src") && (
                <figure>
                  <img
                    className="mt-5 h-[400px]"
                    src={watch("content.2.src")}
                    alt={watch("content.2.caption") || "Image"}
                  />
                </figure>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-6 px-6 mb-4">
          <Button onClick={onClear} variant="outline">
            Clear
          </Button>
          <Button
            type="submit"
            className="bg-blue-700 text-white hover:bg-blue-500"
            isLoading={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Publish
          </Button>
        </div>
      </form>

      <aside className="w-full md:w-64 text-sm text-gray-600 dark:text-gray-300">
        <h3 className="font-semibold mb-2">Writing a Great Post Title</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Think of your post title as a super short (but compelling!)
            description — like an overview of the actual post in one short
            sentence.
          </li>
          <li>
            Use keywords where appropriate to help ensure people can find your
            post by search.
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default AddBlog;
