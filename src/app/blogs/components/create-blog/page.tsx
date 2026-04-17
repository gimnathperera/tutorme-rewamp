"use client";

import { Input } from "@/components/ui/input";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
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
const BlogRenderer = dynamic(() => import("../blog-renderer/BlogRenderer"), {
  ssr: false,
});
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button/button";
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

  const { watch, control, reset, register, handleSubmit, setError, formState } =
    createBlogForm;

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faqs",
  });

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

  const redirect = useRouter();

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
          toast.error(getErrorInApiResult(result) || "Failed to create blog");
        }
        return;
      }
      toast.success("Your blog has been submitted and is pending admin approval.");
      onRegisterSuccess();
    } catch (error) {
      console.error("Unexpected error during blog creation:", error);
      toast.error("An unexpected error occurred while creating the blog.");
    }
  };

  const onRegisterSuccess = () => {
    reset(initialFormValues);
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
            className={`h-9 px-4 text-sm font-medium rounded-lg transition-colors duration-150 ${
              !isPreview
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`h-9 px-4 text-sm font-medium rounded-lg transition-colors duration-150 ${
              isPreview
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
                          <option value={1}>H1</option>
                          <option value={2}>H2</option>
                          <option value={3}>H3</option>
                          <option value={4}>H4</option>
                          <option value={5}>H5</option>
                          <option value={6}>H6</option>
                        </select>
                      </div>
                    )}

                    {blockType === "image" && (
                      <div className="space-y-4">
                        <FileUploadDropzone
                          onUploaded={(url) =>
                            createBlogForm.setValue(
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
                              id={`add-column-${index}`}
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
                                createBlogForm.setValue(
                                  `content.${index}.headers` as const,
                                  newHeaders,
                                );
                                createBlogForm.setValue(
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
                              id={`add-row-${index}`}
                              onClick={() => {
                                const current = watch(
                                  `content.${index}`,
                                ) as any;
                                const colCount = current.headers?.length || 1;
                                const newRows = [
                                  ...(current.rows || []),
                                  Array(colCount).fill(""),
                                ];
                                createBlogForm.setValue(
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
                                            createBlogForm.setValue(
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
                                            createBlogForm.setValue(
                                              `content.${index}.headers` as const,
                                              newHeaders,
                                            );
                                            createBlogForm.setValue(
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
                                            createBlogForm.setValue(
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
                                          createBlogForm.setValue(
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
                          id={`quote-text-${index}`}
                          className="bg-white"
                          placeholder="Quote text"
                          {...register(`content.${index}.text` as const)}
                        />
                        <Input
                          id={`quote-citation-${index}`}
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
                            id={`list-style-${index}`}
                            className="block w-32 rounded-md border-gray-300 py-1.5 bg-white sm:text-sm"
                            {...register(`content.${index}.style` as const)}
                          >
                            <option value="unordered">Bullets</option>
                            <option value="ordered">Numbered</option>
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
                                  id={`list-item-${index}-${iIdx}`}
                                  className="flex-1 h-8 text-sm"
                                  value={item}
                                  onChange={(e) => {
                                    const newItems = [
                                      ...(watch(`content.${index}.items`) ||
                                        []),
                                    ];
                                    newItems[iIdx] = e.target.value;
                                    createBlogForm.setValue(
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
                                    createBlogForm.setValue(
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
                            id={`add-list-item-${index}`}
                            className="w-full border-dashed border text-gray-500 hover:text-blue-600"
                            onClick={() => {
                              const newItems = [
                                ...(watch(`content.${index}.items`) || []),
                                "",
                              ];
                              createBlogForm.setValue(
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
                          id={`embed-src-${index}`}
                          className="bg-white"
                          placeholder="Embed Src URL (e.g. YouTube)"
                          {...register(`content.${index}.src` as const)}
                        />
                        <Input
                          id={`embed-html-${index}`}
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
              <Label htmlFor="coverImage">Cover Image</Label>

              <FileUploadDropzone
                onUploaded={(url) =>
                  createBlogForm.setValue("image", encodeImageUrl(url))
                }
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
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold leading-9">
                  FAQs
                </Label>

                <button
                  type="button"
                  onClick={() => appendFaq({ question: "", answer: "" })}
                  className="h-9 px-4 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors flex items-center"
                >
                  + Add FAQ
                </button>
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
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="h-8 px-3 text-xs font-medium rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    Remove
                  </button>
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

        <div className="flex justify-between items-center mt-6 px-6 mb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => redirect.back()}
              className="h-9 px-4 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onClear}
              className="h-9 px-4 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-9 px-5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
