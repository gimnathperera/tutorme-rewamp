"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button/button";

import { useAuthContext } from "@/contexts";
import {
  useFetchBlogByIdQuery,
  useFetchBlogsQuery,
  useUpdateBlogMutation,
} from "@/store/api/splits/blogs";
import { useFetchTagsQuery } from "@/store/api/splits/tabs";
import { UpdateArticleSchema, updateArticleSchema } from "../schema";

import MultiSelect, { Option } from "@/components/form-controls/multi-select";
import TableOfContents from "../../table-of-content/TableOfContent";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const BlogRenderer = dynamic(() => import("../../blog-renderer/BlogRenderer"), {
  ssr: false,
});
import "react-quill/dist/quill.snow.css";
import FileUploadDropzone from "@/components/upload/file-upload-dropzone";
import {
  BLOG_EDITOR_HEADING_OPTIONS,
  BLOG_EDITOR_LIST_STYLE_OPTIONS,
  BLOG_STATUS_VALUES,
} from "@/configs/options";

export default function EditBlogPage() {
  const params = useParams();
  const blogId = params?.id as string;
  const router = useRouter();
  const { user, isUserLoaded } = useAuthContext();

  const { data: blogsData } = useFetchBlogsQuery({});
  const { data: tagsData } = useFetchTagsQuery({});
  const { data: blog, isLoading } = useFetchBlogByIdQuery(blogId);

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [isPreview, setIsPreview] = useState(false);

  const form = useForm<UpdateArticleSchema>({
    resolver: zodResolver(updateArticleSchema),
    defaultValues: {
      title: "",
      content: [],
      relatedArticles: [],
      tags: [],
      status: "pending",
      image: "",
      faqs: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState,
    setValue,
    setError,
  } = form;

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: "faqs" });

  const {
    fields: contentFields,
    append: appendContent,
    remove: removeContent,
    move: moveContent,
  } = useFieldArray({
    control,
    name: "content",
  });

  const encodeImageUrl = (url: string) => {
    try {
      return encodeURI(decodeURI(url));
    } catch {
      return url;
    }
  };

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const getEditableStatus = (
    status?: string,
  ): UpdateArticleSchema["status"] => {
    return BLOG_STATUS_VALUES.includes(status as UpdateArticleSchema["status"])
      ? (status as UpdateArticleSchema["status"])
      : "pending";
  };

  const tagsOptions: Option[] =
    tagsData?.results?.map((t) => ({ value: t.id, text: t.name })) || [];

  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Guard 1: unauthenticated users → show a login prompt dialog
  useEffect(() => {
    if (isUserLoaded && !user) {
      setShowAuthDialog(true);
    }
  }, [isUserLoaded, user, router]);

  // Guard 2: tutors can only edit their own blogs
  useEffect(() => {
    if (blog && user && user.role === "tutor" && blog.author?.id !== user.id) {
      toast.error("You can only edit your own blogs");
      router.replace(`/blogs/${blog.slug || blog.id}`);
    }
  }, [blog, user, router]);

  useEffect(() => {
    if (blog && user && blogsData && tagsData) {
      const relatedIds = (blog.relatedArticles || [])
        .map((r) => blogsData.results.find((b) => b.id === r.id)?.id)
        .filter(Boolean) as string[];

      const tagIds = (blog.tags || [])
        .map((t) => tagsData.results.find((tag) => tag.id === t.id)?.id)
        .filter(Boolean) as string[];

      reset({
        title: blog.title,
        image: blog.image,
        status: getEditableStatus(blog.status),
        relatedArticles: relatedIds,
        tags: tagIds,
        content: blog.content.map((c) => {
          switch (c.type) {
            case "paragraph":
              return {
                type: "paragraph",
                text: "text" in c ? decodeHtml(c.text) : "",
              };
            case "heading":
              return {
                type: "heading",
                text: "text" in c ? decodeHtml(c.text) : "",
                level: "level" in c ? (c.level as number) : 2,
              };
            case "image":
              return {
                type: "image",
                src: "src" in c ? (c.src as string) : "",
                caption: "caption" in c ? (c.caption as string) : "",
              };
            case "table":
              return {
                type: "table",
                headers: "headers" in c ? (c.headers as string[]) : [],
                rows: "rows" in c ? (c.rows as string[][]) : [],
              };
            case "quote":
              return {
                type: "quote",
                text: "text" in c ? decodeHtml(c.text) : "",
                citation: "citation" in c ? (c.citation as string) : "",
              };
            case "list":
              return {
                type: "list",
                items: "items" in c ? (c.items as string[]) : [""],
                style: ("style" in c ? c.style : "unordered") as
                  | "ordered"
                  | "unordered",
              };
            case "embed":
              return {
                type: "embed",
                src: "src" in c ? (c.src as string) : "",
                html: "html" in c ? (c.html as string) : "",
              };
            default:
              return { type: "paragraph", text: "" };
          }
        }),
        faqs: (blog.faqs || []).map((faq) => ({
          question: faq?.question || "",
          answer: faq?.answer || "",
        })),
      });
    }
  }, [blog, user, blogsData, tagsData, reset]);

  const onSubmit = async (data: UpdateArticleSchema) => {
    if (!user) return toast.error("Please authenticate");

    const wasRejected = blog?.status === "rejected";

    try {
      const payload: any = {
        id: blogId,
        blogId: blogId,
        title: data.title,
        image: data.image,
        content: data.content,
        relatedArticles: data.relatedArticles ?? [],
        tags: data.tags ?? [],
        faqs: data.faqs ?? [],
      };

      const result = await updateBlog(payload);
      if ("error" in result) {
        const errData = (result.error as any)?.data;
        if (errData?.error && typeof errData.error === "object") {
          Object.entries(errData.error).forEach(([key, value]) => {
            setError(key as any, {
              type: "server",
              message: value as string,
            });
          });
          toast.error("Please fix the validation errors.");
        } else {
          toast.error("Failed to update blog");
        }
        return;
      }
      toast.success(
        wasRejected
          ? "Blog resubmitted for review."
          : "Blog updated successfully!",
      );
      router.push(`/blogs/${blogId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    }
  };

  if (!isUserLoaded) return null; // wait for auth to hydrate

  // Show auth dialog for unauthenticated users
  if (showAuthDialog) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-3xl">
            🔒
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Login Required
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              You need to be logged in to edit this blog. Please sign in to
              continue.
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => router.replace("/blogs")}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => router.replace("/sign-in")}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col bg-white m-5 md:flex-row gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
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
            <input
              id="title"
              placeholder="Blog Title"
              className="text-4xl h-20 w-full font-semibold focus:outline-none placeholder-gray-400"
              {...register("title")}
            />
            {formState.errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {formState.errors.title.message}
              </p>
            )}

            <div className="space-y-6">
              <Label className="text-xl font-semibold border-b pb-2 flex">
                Content Blocks
              </Label>
              {contentFields.map((field, index) => {
                const blockType = watch(`content.${index}.type`);
                return (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50 relative group"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-700 capitalize">
                        {blockType} Block
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => moveContent(index, index - 1)}
                          disabled={index === 0}
                          className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveContent(index, index + 1)}
                          disabled={index === contentFields.length - 1}
                          className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeContent(index)}
                          className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {blockType === "paragraph" && (
                      <div>
                        <Controller
                          name={`content.${index}.text` as const}
                          control={control}
                          render={({ field }) => (
                            <ReactQuill
                              theme="snow"
                              value={field.value || ""}
                              onChange={field.onChange}
                              className="bg-white rounded [&_.ql-toolbar]:rounded-t [&_.ql-container]:rounded-b"
                              placeholder="Write paragraph text here..."
                            />
                          )}
                        />
                      </div>
                    )}

                    {blockType === "heading" && (
                      <div className="space-y-2 flex gap-2 w-full">
                        <Input
                          className="flex-1 bg-white"
                          placeholder="Heading text"
                          {...register(`content.${index}.text` as const)}
                        />
                        <select
                          className="block w-24 rounded-md border-gray-300 py-2 pl-3 pr-8 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm bg-white"
                          {...register(`content.${index}.level` as const, {
                            valueAsNumber: true,
                          })}
                        >
                          {BLOG_EDITOR_HEADING_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.text}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {blockType === "image" && (
                      <div className="space-y-4">
                        <FileUploadDropzone
                          onUploaded={(url) =>
                            setValue(
                              `content.${index}.src` as const,
                              encodeImageUrl(url),
                            )
                          }
                        />
                        {watch(`content.${index}.src` as const) && (
                          <img
                            src={watch(`content.${index}.src` as const)}
                            alt="Preview"
                            className="mt-2 max-h-48 rounded-lg object-cover"
                          />
                        )}
                        <Input
                          className="bg-white"
                          placeholder="Image caption (optional)"
                          {...register(`content.${index}.caption` as const)}
                        />
                      </div>
                    )}

                    {blockType === "table" && (
                      <div className="space-y-4 p-4 bg-white rounded-lg border shadow-inner">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Table Configuration
                          </span>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              id={`edit-add-column-${index}`}
                              onClick={() => {
                                const current = watch(
                                  `content.${index}`,
                                ) as any;
                                const newHeaders = [
                                  ...(current.headers || []),
                                  `Col ${(current.headers?.length || 0) + 1}`,
                                ];
                                const newRows = (current.rows || []).map(
                                  (row: string[]) => [...row, ""],
                                );
                                setValue(
                                  `content.${index}.headers` as const,
                                  newHeaders,
                                );
                                setValue(
                                  `content.${index}.rows` as const,
                                  newRows,
                                );
                              }}
                            >
                              + Column
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              id={`edit-add-row-${index}`}
                              onClick={() => {
                                const current = watch(
                                  `content.${index}`,
                                ) as any;
                                const colCount = current.headers?.length || 1;
                                const newRows = [
                                  ...(current.rows || []),
                                  Array(colCount).fill(""),
                                ];
                                setValue(
                                  `content.${index}.rows` as const,
                                  newRows,
                                );
                              }}
                            >
                              + Row
                            </Button>
                          </div>
                        </div>

                        <div className="overflow-x-auto border rounded">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                {(watch(`content.${index}.headers`) || []).map(
                                  (header: string, hIdx: number) => (
                                    <th
                                      key={hIdx}
                                      className="border p-2 bg-gray-50"
                                    >
                                      <div className="flex flex-col gap-1">
                                        <Input
                                          className="h-8 text-xs font-bold"
                                          value={header}
                                          onChange={(e) => {
                                            const newHeaders = [
                                              ...(watch(
                                                `content.${index}.headers`,
                                              ) || []),
                                            ];
                                            newHeaders[hIdx] = e.target.value;
                                            setValue(
                                              `content.${index}.headers` as const,
                                              newHeaders,
                                            );
                                          }}
                                        />
                                        <button
                                          type="button"
                                          className="text-[10px] text-red-500 hover:underline"
                                          onClick={() => {
                                            const newHeaders = (
                                              watch(
                                                `content.${index}.headers`,
                                              ) || []
                                            ).filter(
                                              (_: any, i: number) => i !== hIdx,
                                            );
                                            const newRows = (
                                              watch(`content.${index}.rows`) ||
                                              []
                                            ).map((row: string[]) =>
                                              row.filter(
                                                (_: any, i: number) =>
                                                  i !== hIdx,
                                              ),
                                            );
                                            setValue(
                                              `content.${index}.headers` as const,
                                              newHeaders,
                                            );
                                            setValue(
                                              `content.${index}.rows` as const,
                                              newRows,
                                            );
                                          }}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </th>
                                  ),
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {(watch(`content.${index}.rows`) || []).map(
                                (row: string[], rIdx: number) => (
                                  <tr key={rIdx}>
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="border p-2">
                                        <Input
                                          className="h-8 text-xs border-none focus:ring-0"
                                          value={cell}
                                          onChange={(e) => {
                                            const newRows = [
                                              ...(watch(
                                                `content.${index}.rows`,
                                              ) || []),
                                            ];
                                            const newRow = [...newRows[rIdx]];
                                            newRow[cIdx] = e.target.value;
                                            newRows[rIdx] = newRow;
                                            setValue(
                                              `content.${index}.rows` as const,
                                              newRows,
                                            );
                                          }}
                                        />
                                      </td>
                                    ))}
                                    <td className="border p-1 w-8">
                                      <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => {
                                          const newRows = (
                                            watch(`content.${index}.rows`) || []
                                          ).filter(
                                            (_: any, i: number) => i !== rIdx,
                                          );
                                          setValue(
                                            `content.${index}.rows` as const,
                                            newRows,
                                          );
                                        }}
                                      >
                                        ×
                                      </button>
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {blockType === "quote" && (
                      <div className="space-y-2">
                        <Input
                          id={`edit-quote-text-${index}`}
                          className="bg-white"
                          placeholder="Quote text"
                          {...register(`content.${index}.text` as const)}
                        />
                        <Input
                          id={`edit-quote-citation-${index}`}
                          className="bg-white"
                          placeholder="Citation (optional)"
                          {...register(`content.${index}.citation` as const)}
                        />
                      </div>
                    )}

                    {blockType === "list" && (
                      <div className="space-y-4 p-4 bg-white rounded-lg border">
                        <div className="flex gap-4 items-center">
                          <Label className="text-sm">List Style:</Label>
                          <select
                            id={`edit-list-style-${index}`}
                            className="block w-32 rounded-md border-gray-300 py-1.5 bg-white sm:text-sm"
                            {...register(`content.${index}.style` as const)}
                          >
                            {BLOG_EDITOR_LIST_STYLE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.text}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          {(watch(`content.${index}.items`) || []).map(
                            (item: string, iIdx: number) => (
                              <div
                                key={iIdx}
                                className="flex gap-2 items-center"
                              >
                                <span className="text-gray-400 text-xs w-4">
                                  {watch(`content.${index}.style`) === "ordered"
                                    ? `${iIdx + 1}.`
                                    : "•"}
                                </span>
                                <Input
                                  id={`edit-list-item-${index}-${iIdx}`}
                                  className="flex-1 h-8 text-sm"
                                  value={item}
                                  onChange={(e) => {
                                    const newItems = [
                                      ...(watch(`content.${index}.items`) ||
                                        []),
                                    ];
                                    newItems[iIdx] = e.target.value;
                                    setValue(
                                      `content.${index}.items` as const,
                                      newItems,
                                    );
                                  }}
                                />
                                <button
                                  type="button"
                                  className="text-red-500 hover:bg-red-50 rounded p-1"
                                  onClick={() => {
                                    const newItems = (
                                      watch(`content.${index}.items`) || []
                                    ).filter((_: any, i: number) => i !== iIdx);
                                    setValue(
                                      `content.${index}.items` as const,
                                      newItems,
                                    );
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ),
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            id={`edit-add-list-item-${index}`}
                            className="w-full border-dashed border text-gray-500 hover:text-blue-600"
                            onClick={() => {
                              const newItems = [
                                ...(watch(`content.${index}.items`) || []),
                                "",
                              ];
                              setValue(
                                `content.${index}.items` as const,
                                newItems,
                              );
                            }}
                          >
                            + Add Item
                          </Button>
                        </div>
                      </div>
                    )}

                    {blockType === "embed" && (
                      <div className="space-y-2">
                        <Input
                          id={`edit-embed-src-${index}`}
                          className="bg-white"
                          placeholder="Embed Src URL (e.g. YouTube)"
                          {...register(`content.${index}.src` as const)}
                        />
                        <Input
                          id={`edit-embed-html-${index}`}
                          className="bg-white"
                          placeholder="Or raw HTML"
                          {...register(`content.${index}.html` as const)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex flex-wrap gap-2 mt-4 p-4 border-2 border-dashed border-gray-200 rounded-xl justify-center">
                <button
                  type="button"
                  onClick={() => appendContent({ type: "paragraph", text: "" })}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium"
                >
                  + Text
                </button>
                <button
                  type="button"
                  onClick={() =>
                    appendContent({ type: "heading", text: "", level: 2 })
                  }
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium"
                >
                  + Heading
                </button>
                <button
                  type="button"
                  onClick={() =>
                    appendContent({ type: "image", src: "", caption: "" })
                  }
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium"
                >
                  + Image
                </button>
                <button
                  type="button"
                  onClick={() =>
                    appendContent({ type: "quote", text: "", citation: "" })
                  }
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium"
                >
                  + Quote
                </button>
                <button
                  type="button"
                  onClick={() =>
                    appendContent({ type: "table", headers: [], rows: [] })
                  }
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium"
                >
                  + Table
                </button>
                <button
                  type="button"
                  onClick={() =>
                    appendContent({
                      type: "list",
                      items: [""],
                      style: "unordered",
                    })
                  }
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium"
                >
                  + List
                </button>
                <button
                  type="button"
                  onClick={() =>
                    appendContent({ type: "embed", src: "", html: "" })
                  }
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium"
                >
                  + Embed
                </button>
              </div>
            </div>
            <div className="mb-4">
              <Label>Cover Image</Label>
              <FileUploadDropzone
                key="cover-dropzone"
                onUploaded={(url) => setValue("image", encodeImageUrl(url))}
              />
              {watch("image") && (
                <img
                  src={watch("image")}
                  alt="Cover Preview"
                  className="mt-2 max-h-48 w-full rounded-lg object-cover"
                />
              )}
            </div>

            <div>
              <Label>Tags</Label>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <MultiSelect
                    key={JSON.stringify(field.value)}
                    options={tagsOptions}
                    defaultSelected={field.value}
                    onChange={field.onChange}
                    label={""}
                  />
                )}
              />
            </div>
            <div className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <Label>FAQs</Label>
                <Button
                  type="button"
                  onClick={() => appendFaq({ question: "", answer: "" })}
                  variant="default"
                  className="bg-black text-white hover:transition-opacity"
                >
                  Add FAQ
                </Button>
              </div>
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
                  <Button
                    type="button"
                    variant="outline"
                    className="h-fit bg-red-500 text-white"
                    onClick={() => removeFaq(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="m-10">
              {watch("image") && (
                <div className="relative w-full mb-8 rounded-lg overflow-hidden">
                  <img
                    src={watch("image")}
                    alt="Cover Image"
                    className="w-full h-[350px] md:h-[450px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                      {watch("title") || "Your Blog Title Here"}
                    </h1>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col m-10 md:flex-row gap-6 mt-6">
              <div className="flex-1 bg-white shadow-sm p-6 rounded-lg">
                <TableOfContents
                  html={
                    watch("content")
                      ?.filter(
                        (b: any) =>
                          b.type === "heading" || b.type === "paragraph",
                      )
                      ?.map((b: any) =>
                        b.type === "heading"
                          ? `<h${b.level}>${b.text}</h${b.level}>`
                          : b.text,
                      )
                      .join("\n") || ""
                  }
                />

                <div className="mt-8">
                  <BlogRenderer content={(watch("content") as any) || []} />
                </div>
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
                                Tuition Lanka
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

        <div className="flex justify-between items-center mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/blogs/${blogId}`)}
          >
            Cancel
          </Button>

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
