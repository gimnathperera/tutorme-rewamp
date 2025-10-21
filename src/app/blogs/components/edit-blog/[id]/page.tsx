"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Controller,
  useForm,
  FieldError,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import MultiSelect, { Option } from "@/components/MultiSelect";

import { CreateArticleSchema, createArticleSchema } from "../schema";
import {
  useFetchBlogByIdQuery,
  useFetchBlogsQuery,
  useUpdateBlogMutation,
} from "@/store/api/splits/blogs";
import { useAuthContext } from "@/contexts";
import TableOfContents from "../../table-of-content/TableOfContent";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { useFetchTagsQuery } from "@/store/api/splits/tabs";

export default function EditBlogPage() {
  const params = useParams();
  const blogId = params?.id as string;
  const router = useRouter();
  const { user } = useAuthContext();

  const { data: blog, isLoading } = useFetchBlogByIdQuery(blogId);
  const { data: blogsData } = useFetchBlogsQuery({});
  const { data: tagsData } = useFetchTagsQuery({});
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [isPreview, setIsPreview] = useState(false);

  const form = useForm<CreateArticleSchema>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: "",
      author: { name: "", avatar: "", role: "" },
      content: [],
      relatedArticles: [],
      tags: [],
      status: "pending",
      image: "",
      faqs: [],
    },
  });

  const { register, handleSubmit, control, reset, watch, formState } = form;

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: "faqs",
  });

  const blogOptions: Option[] =
    blogsData?.results.map((b) => ({ value: b.id, text: b.title })) || [];
  const tagsOptions: Option[] =
    tagsData?.results?.map((t) => ({ value: t.id, text: t.name })) || [];

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    if (blog && user) {
      reset({
        title: blog.title,
        image: blog.image,
        status: blog.status || "pending",
        author: {
          name: user.name,
          avatar: user.avatar || "https://example.com/default-avatar.png",
          role: user.role,
        },
        relatedArticles: blog.relatedArticles?.map((r) => r.id) || [],
        tags: blog.tags?.map((t) => t.id) || [],
        content: blog.content.map((c) => ({
          type: c.type,
          text: "text" in c ? decodeHtml(c.text) : "",
          src: "src" in c ? c.src : "",
          caption: "caption" in c ? c.caption : "Cover Image",
          level: "level" in c ? c.level : 1,
        })),
        faqs: (blog.faqs || []).map((faq) => ({
          question: faq?.question || "",
          answer: faq?.answer || "",
        })),
      });
    }
  }, [blog, user, reset]);

  const getContentError = (index: number, field: "text" | "src") => {
    const contentError = formState.errors.content?.[index];
    if (
      contentError &&
      typeof contentError === "object" &&
      field in contentError
    ) {
      return (contentError as Record<string, FieldError>)[field]?.message;
    }
    return undefined;
  };

  const onSubmit = async (data: CreateArticleSchema) => {
    if (!user) return toast.error("Please authenticate");

    try {
      const imageContent = data.content.find((c) => c.type === "image");
      const payload = {
        id: blogId,
        title: data.title,
        image: imageContent?.src || data.image || "",
        author: {
          name: user.name,
          avatar: user.avatar || "https://example.com/default-avatar.png",
          role: user.role,
        },
        relatedArticles: data.relatedArticles,
        tags: data.tags,
        content: data.content,
        faqs: data.faqs,
        status: data.status,
      };
      const result = await updateBlog(payload);
      if ("error" in result) return toast.error("Failed to update blog");

      toast.success("Blog updated successfully");
      router.push(`/blogs/${blogId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col bg-white m-5 md:flex-row gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
        {/* Edit/Preview Toggle */}
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
            className="bg-black  text-white"
            variant={isPreview ? "default" : "outline"}
            onClick={() => setIsPreview(true)}
          >
            Preview
          </Button>
        </div>

        {!isPreview ? (
          <div className="p-6 space-y-6">
            <input
              placeholder="Blog Title"
              className="text-[30pt] w-full font-semibold focus:outline-none placeholder-gray-400"
              {...register("title")}
            />
            {formState.errors.title && (
              <p className="text-red-500">{formState.errors.title.message}</p>
            )}
            {watch("content").map((c, idx) => {
              if (c.type === "heading")
                return (
                  <div key={idx}>
                    <Label htmlFor="heading">Subtitle</Label>
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
                    {getContentError(idx, "text") && (
                      <p className="text-red-500">
                        {getContentError(idx, "text")}
                      </p>
                    )}
                  </div>
                );
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
                          className="bg-white rounded-lg [&_.ql-toolbar]:border-0 [&_.ql-container]:border-0 [&_.ql-editor.ql-blank::before]:text-gray-400 [&_.ql-editor.ql-blank::before]:italic"
                        />
                      )}
                    />
                    {getContentError(idx, "text") && (
                      <p className="text-red-500">
                        {getContentError(idx, "text")}
                      </p>
                    )}
                  </div>
                );

              if (c.type === "image")
                return (
                  <div key={idx}>
                    <Label htmlFor="image">Content Image URL</Label>
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
                      type="hidden"
                      value={c.caption}
                      {...register(`content.${idx}.caption` as const)}
                    />
                    {getContentError(idx, "src") && (
                      <p className="text-red-500">
                        {getContentError(idx, "src")}
                      </p>
                    )}
                  </div>
                );
              return null;
            })}

            <div className="">
              <Label htmlFor="image">Cover Image URL</Label>
              <Input
                id="image"
                placeholder="Add Cover Image Url"
                className="rounded-md"
                {...register("image")}
              />
              {formState.errors.image && (
                <p className="text-sm text-red-500">
                  {formState.errors.image.message}
                </p>
              )}
            </div>

            {/* Related Articles & Tags */}
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
                    options={tagsOptions}
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
                    <Input
                      placeholder="Answer"
                      {...register(`faqs.${index}.answer` as const)}
                    />
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
              <Button
                type="button"
                onClick={() => appendFaq({ question: "", answer: "" })}
                variant="default"
                className="bg-black text-white"
              >
                Add FAQ
              </Button>
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
                        "<p>Nothing to preview yet...</p>"
                    ),
                  }}
                />

                {/* FAQs */}
                {watch("faqs")?.length > 0 && (
                  <div className="mt-8 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">FAQs</h3>
                    <ul className="space-y-2">
                      {watch("faqs").map((faq, idx) => (
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

              {/* Sidebar: Related Articles */}
              <aside className="w-full md:w-[30%] border rounded-lg p-4 bg-white shadow-sm h-fit">
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                  Related Articles
                </h3>
                <ul className="space-y-4">
                  {(watch("relatedArticles") || []).length > 0 ? (
                    watch("relatedArticles").map(
                      (relatedId: string, idx: number) => {
                        const related = blogsData?.results.find(
                          (b) => b.id === relatedId
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
                      }
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

        <div className="flex justify-end items-end mt-6 px-6 mb-4">
          <Button
            type="submit"
            className="bg-blue-700 hover:bg-blue-500 text-lg p-5 text-white"
            isLoading={isUpdating}
          >
            Update Blog
          </Button>
        </div>
      </form>
    </div>
  );
}
