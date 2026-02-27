"use client";

import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Controller,
  useForm,
  FieldError,
  useFieldArray,
} from "react-hook-form";
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
import MultiSelect, { Option } from "@/components/form-controls/multi-select";
import { useAuthContext } from "@/contexts";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";
import { useFetchTagsQuery } from "@/store/api/splits/tabs";
import TableOfContents from "../table-of-content/TableOfContent";
import FileUploadDropzone from "@/components/upload/file-upload-dropzone";

const AddBlog = () => {
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const { data: blogsData } = useFetchBlogsQuery({});
  const { data: tagData } = useFetchTagsQuery({});
  const { user } = useAuthContext();
  const [isPreview, setIsPreview] = useState(false);

  const createBlogForm = useForm<CreateArticleSchema>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const { formState, watch, control, reset, register, handleSubmit } =
    createBlogForm;

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faqs",
  });

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const getContentError = (
    index: number,
    field: "text" | "src",
  ): string | undefined => {
    const contentError = formState.errors.content?.[index];
    if (
      contentError &&
      typeof contentError === "object" &&
      field in contentError
    ) {
      const fieldError = (contentError as Record<string, FieldError>)[field];
      return fieldError?.message;
    }
    return undefined;
  };

  const redirect = useRouter();

  useEffect(() => {
    if (user) {
      reset({
        ...initialFormValues,
        author: {
          name: user.name,
          avatar: user.avatar || "/images/profile/pp.png",
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

  const tagOptions: Option[] =
    tagData?.results.map((tag) => ({
      value: tag.id,
      text: tag.name,
    })) || [];

  const onSubmit = async (data: CreateArticleSchema) => {
    if (!user) {
      toast.error("Please authenticate");
      return;
    }

    try {
      const result = await createBlog(data);
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);

      if ("data" in result) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error("Unexpected error during blog creation:", error);
      toast.error("An unexpected error occurred while creating the blog.");
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
        <div className="flex gap-2 mt-6 px-6">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`h-9 px-4 text-sm font-medium rounded-lg transition-colors duration-150 ${!isPreview
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`h-9 px-4 text-sm font-medium rounded-lg transition-colors duration-150 ${isPreview
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Preview
          </button>
        </div>

        {!isPreview ? (
          <div className="p-6 space-y-6">
            <input
              id="title"
              placeholder="Blog Title"
              className="text-[30pt] h-20 w-full font-semibold focus:outline-none placeholder-gray-400"
              {...register("title")}
            />
            {formState.errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {formState.errors.title.message}
              </p>
            )}

            <div className="mb-2">
              <Label htmlFor="image">Subtitle</Label>
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
                placeholder="Blog Sub Title"
                className="mt-2 border-none rounded-md"
                {...register("content.1.text")}
              />
              {getContentError(1, "text") && (
                <p className="text-sm text-red-500">
                  {getContentError(1, "text")}
                </p>
              )}
            </div>

            <div className="shadow-sm">
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
                      placeholder="Blog Content"
                      className="bg-white rounded-lg [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:border-0 [&_.ql-container]:rounded-b-lg [&_.ql-editor.ql-blank::before]:text-gray-400 [&_.ql-editor.ql-blank::before]:italic"
                    />
                  )}
                />
                {getContentError(0, "text") && (
                  <p className="text-sm text-red-500">
                    {getContentError(0, "text")}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <Label htmlFor="contentImage">Content Image</Label>
                <Input
                  type="hidden"
                  value="image"
                  {...register("content.2.type")}
                />
                <Input
                  type="hidden"
                  value="Cover Image"
                  {...register("content.2.caption")}
                />

                <FileUploadDropzone
                  onUploaded={(url) =>
                    createBlogForm.setValue("content.2.src", url)
                  }
                />

                {getContentError(2, "src") && (
                  <p className="text-sm text-red-500">
                    {getContentError(2, "src")}
                  </p>
                )}

                {watch("content.2.src") && (
                  <img
                    src={watch("content.2.src")}
                    alt="Content Preview"
                    className="mt-2 max-h-48 rounded-lg object-cover"
                  />
                )}
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="coverImage">Cover Image</Label>

              <FileUploadDropzone
                onUploaded={(url) => createBlogForm.setValue("image", url)}
              />

              {formState.errors.image && (
                <p className="text-sm text-red-500">
                  {formState.errors.image.message}
                </p>
              )}

              {watch("image") && (
                <img
                  src={watch("image")}
                  alt="Cover Preview"
                  className="mt-2 max-h-48 w-full rounded-lg object-cover"
                />
              )}
            </div>
            <div className="border-none rounded-lg">
              <Label className="mx-1">Related Articles</Label>
              <Controller
                name="relatedArticles"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label=""
                    options={blogOptions}
                    defaultSelected={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="border-none rounded-lg">
              <Label className="mx-1">Tags</Label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label=""
                    options={tagOptions}
                    defaultSelected={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="p-4 border rounded-lg space-y-4">
              <Label>FAQs</Label>
              {faqFields.map((faq, index) => (
                <div key={faq.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <Input
                      placeholder="Question"
                      {...register(`faqs.${index}.question` as const)}
                    />
                    {formState.errors.faqs?.[index]?.question && (
                      <p className="text-sm text-red-500">
                        {formState.errors.faqs[index]?.question?.message}
                      </p>
                    )}
                    <Input
                      placeholder="Answer"
                      {...register(`faqs.${index}.answer` as const)}
                    />
                    {formState.errors.faqs?.[index]?.answer && (
                      <p className="text-sm text-red-500">
                        {formState.errors.faqs[index]?.answer?.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="h-8 px-3 text-xs font-medium rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendFaq({ question: "", answer: "" })}
                className="h-9 px-4 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
              >
                + Add FAQ
              </button>
            </div>

            <input type="hidden" value="pending" {...register("status")} />
          </div>
        ) : (
          <>
            <div className="m-10">
              {watch("content.2.src") && (
                <div className="relative w-full mb-8 rounded-lg overflow-hidden">
                  <img
                    src={watch("content.2.src")}
                    alt="Cover Image"
                    className="w-full h-[350px] md:h-[450px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                      {watch("title") || "Your Blog Title Here"}
                    </h1>
                    {watch("content.1.text") && (
                      <p className="text-lg md:text-xl text-gray-200 mt-3 max-w-3xl italic">
                        {watch("content.1.text")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col m-10 md:flex-row gap-6 mt-6">
              <div className="flex-1 bg-white shadow-sm">
                {watch("image") && (
                  <figure className="flex justify-center mb-6">
                    <img
                      className="rounded-lg max-h-[400px] w-full object-cover"
                      src={watch("image")}
                      alt="Cover Image"
                    />
                  </figure>
                )}

                <TableOfContents html={watch("content.0.text")} />

                <div
                  className="blog-content max-w-none text-justify mt-6"
                  dangerouslySetInnerHTML={{
                    __html: decodeHtml(
                      watch("content.0.text") ||
                      "<p>Nothing to preview yet...</p>",
                    ),
                  }}
                />
                {(watch("faqs") ?? []).length > 0 && (
                  <div className="mt-8 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">FAQs</h3>
                    <ul className="space-y-2">
                      {(watch("faqs") ?? []).map((faq, idx) => (
                        <li key={idx} className="border-b pb-2">
                          <p className="font-medium text-blue-700">
                            {faq.question}
                          </p>
                          <p className="font-light">{faq.answer}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <aside className="w-full md:w-[30%] border rounded-lg p-4 bg-white shadow-sm h-fit">
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                  Related Articles
                </h3>
                <ul className="space-y-4">
                  {(watch("relatedArticles") ?? []).length > 0 ? (
                    (watch("relatedArticles") ?? []).map(
                      (relatedId: string, idx: number) => {
                        const related = blogsData?.results.find(
                          (b) => b.id === relatedId,
                        );
                        return (
                          <li key={idx} className="flex items-center gap-3">
                            <img
                              src={related?.image || "/placeholder.png"}
                              alt="thumbnail"
                              className="w-16 h-16 rounded-md object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-800 hover:underline cursor-pointer">
                                {related?.title || "Untitled Post"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {related?.author?.name || "Unknown Author"}
                              </p>
                            </div>
                          </li>
                        );
                      },
                    )
                  ) : (
                    <p className="text-sm text-gray-500">
                      No related posts selected.
                    </p>
                  )}
                </ul>
              </aside>
            </div>
          </>
        )}

        <div className="flex justify-between items-center mt-6 px-6 mb-4">
          <button
            type="button"
            onClick={onClear}
            className="h-9 px-4 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="h-9 px-5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
