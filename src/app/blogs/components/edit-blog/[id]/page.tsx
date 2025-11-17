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

import MultiSelect, { Option } from "@/components/MultiSelect";
import TableOfContents from "../../table-of-content/TableOfContent";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import FileUploadDropzone from "@/components/fileUploader";

export default function EditBlogPage() {
  const params = useParams();
  const blogId = params?.id as string;
  const router = useRouter();
  const { user } = useAuthContext();

  const { data: blogsData } = useFetchBlogsQuery({});
  const { data: tagsData } = useFetchTagsQuery({});
  const { data: blog, isLoading, refetch } = useFetchBlogByIdQuery(blogId);

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [isPreview, setIsPreview] = useState(false);

  const form = useForm<UpdateArticleSchema>({
    resolver: zodResolver(updateArticleSchema),
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

  const { register, handleSubmit, control, reset, watch, formState, setValue } =
    form;

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: "faqs" });

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const blogOptions: Option[] =
    blogsData?.results.map((b) => ({ value: b.id, text: b.title })) || [];
  const tagsOptions: Option[] =
    tagsData?.results?.map((t) => ({ value: t.id, text: t.name })) || [];

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
        status: blog.status || "pending",
        author: {
          name: user.name,
          avatar: user.avatar || "https://example.com/default-avatar.png",
          role: user.role,
        },
        relatedArticles: relatedIds,
        tags: tagIds,
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
  }, [blog, user, blogsData, tagsData, reset]);

  const getContentError = (index: number, field: "text" | "src") => {
    const contentError = formState.errors.content?.[index];
    if (
      contentError &&
      typeof contentError === "object" &&
      field in contentError
    )
      return (contentError as any)[field]?.message;
    return undefined;
  };

  const onSubmit = async (data: UpdateArticleSchema) => {
    if (!user) return toast.error("Please authenticate");

    try {
      const imageContent = data.content.find((c) => c.type === "image");
      const payload = {
        id: blogId,
        title: data.title,
        image: data.image,
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

      await updateBlog(payload).unwrap();
      await refetch();
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
              className="text-[30pt] h-20 w-full font-semibold focus:outline-none placeholder-gray-400"
              {...register("title")}
            />
            {formState.errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {formState.errors.title.message}
              </p>
            )}

            {watch("content").map((c, idx) => {
              if (c.type === "paragraph" || c.type === "heading") {
                return (
                  <Controller
                    key={idx}
                    name={`content.${idx}.text` as const}
                    control={control}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Write paragraph..."
                        className="mb-4"
                      />
                    )}
                  />
                );
              }
              return null;
            })}

            {watch("content").map((c, idx) => {
              if (c.type === "image") {
                return (
                  <div key={idx} className="mb-4">
                    <Label>Content Image</Label>
                    <FileUploadDropzone
                      onUploaded={(url) => setValue(`content.${idx}.src`, url)}
                    />
                    {getContentError(idx, "src") && (
                      <p className="text-sm text-red-500">
                        {getContentError(idx, "src")}
                      </p>
                    )}
                    {watch(`content.${idx}.src`) && (
                      <img
                        src={watch(`content.${idx}.src`)}
                        alt="Content Preview"
                        className="mt-2 max-h-48 rounded-lg object-cover"
                      />
                    )}
                  </div>
                );
              }
              return null;
            })}
            <div className="mb-4">
              <Label>Cover Image</Label>
              <FileUploadDropzone
                key="cover-dropzone"
                onUploaded={(url) => setValue("image", url)}
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
                name="tags"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label=""
                    options={tagsOptions}
                    defaultSelected={field.value}
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
                className="bg-black text-white hover:transition-opacity"
              >
                Add FAQ
              </Button>
            </div>
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

        <div className="flex justify-end mt-6">
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
