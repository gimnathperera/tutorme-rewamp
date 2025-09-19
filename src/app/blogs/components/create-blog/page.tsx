"use client";

import { Button } from "@/components/ui/Button/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

export function AddBlog() {
  const [open, setOpen] = useState(false);
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const { data: blogsData, isLoading: blogsLoading } = useFetchBlogsQuery({});

  const createBlogForm = useForm({
    resolver: zodResolver(createArticleSchema),
    defaultValues: initialFormValues as CreateArticleSchema,
    mode: "onChange",
  });

  const { formState } = createBlogForm;
  const blogOptions: Option[] =
    blogsData?.results.map((blog) => ({
      value: blog.id,
      text: blog.title,
    })) || [];

  const onSubmit = async (data: CreateArticleSchema) => {
    const imageContent = data.content.find((c) => c.type === "image");

    const payload = {
      ...data,
      image: imageContent?.src || "",
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
    createBlogForm.reset();
    toast.success("Blog created successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={createBlogForm.handleSubmit(onSubmit)}>
        <div className="flex justify-end items-end">
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-black text-white p-5 text-lg hover:bg-blue-500"
            >
              Add Blog
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[625px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
          <DialogHeader>
            <DialogTitle>Add Blog</DialogTitle>
            <DialogDescription>Add a new blog to the list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Title"
                {...createBlogForm.register("title")}
              />
              {formState.errors.title && (
                <p className="text-sm text-red-500">
                  {formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Author */}
            <div className="grid gap-3">
              <Label htmlFor="author.name">Author Name</Label>
              <Input
                id="author.name"
                placeholder="Author Name"
                {...createBlogForm.register("author.name")}
              />
              {formState.errors.author?.name && (
                <p className="text-sm text-red-500">
                  {formState.errors.author?.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="author.avatar">Author Avatar</Label>
              <Input
                id="author.avatar"
                placeholder="Avatar URL"
                type="text"
                {...createBlogForm.register("author.avatar")}
              />
              {formState.errors.author?.avatar && (
                <p className="text-sm text-red-500">
                  {formState.errors.author?.avatar.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="author.role">Author Role</Label>
              <Input
                id="author.role"
                placeholder="Role"
                type="text"
                {...createBlogForm.register("author.role")}
              />
              {formState.errors.author?.role && (
                <p className="text-sm text-red-500">
                  {formState.errors.author?.role.message}
                </p>
              )}
            </div>

            {/* Content */}
            {/* Paragraph */}
            <Input
              type="hidden"
              value="paragraph"
              {...createBlogForm.register("content.0.type")}
            />
            <Label htmlFor="content.0.text">Paragraph</Label>
            <Input
              id="content.0.text"
              placeholder="Paragraph text"
              {...createBlogForm.register("content.0.text")}
            />
            {formState.errors.content?.[0]?.text && (
              <p className="text-sm text-red-500">
                {formState.errors.content[0]?.text?.message}
              </p>
            )}

            {/* Heading */}
            <Input
              type="hidden"
              value="heading"
              {...createBlogForm.register("content.1.type")}
            />
            <Input
              type="hidden"
              value="2"
              {...createBlogForm.register("content.1.level", {
                valueAsNumber: true,
              })}
            />
            <Input
              id="content.1.text"
              placeholder="Heading text"
              {...createBlogForm.register("content.1.text")}
            />
            {formState.errors.content?.[1]?.text && (
              <p className="text-sm text-red-500">
                {formState.errors.content[1]?.text?.message}
              </p>
            )}

            {/* Image */}
            <Input
              type="hidden"
              value="image"
              {...createBlogForm.register("content.2.type")}
            />
            <Input
              id="content.2.src"
              placeholder="Image URL"
              {...createBlogForm.register("content.2.src")}
            />
            {formState.errors.content?.[2]?.src && (
              <p className="text-sm text-red-500">
                {formState.errors.content[2]?.src?.message}
              </p>
            )}
            {/* Image Caption */}
            <div className="grid gap-3">
              <Label htmlFor="content.2.caption">Image Caption</Label>
              <Input
                id="content.2.caption"
                placeholder="Caption for the image (optional)"
                {...createBlogForm.register("content.2.caption")}
              />
              {formState.errors.content?.[2]?.message && (
                <p className="text-sm text-red-500">
                  {formState.errors.content[2]?.message as string}
                </p>
              )}
            </div>

            {/* Related Articles */}
            <div className="grid gap-3">
              <Label htmlFor="relatedArticles">Related Articles</Label>
              <Controller
                name="relatedArticles"
                control={createBlogForm.control}
                render={({ field }) => (
                  <MultiSelect
                    label="Related Articles"
                    options={blogOptions}
                    defaultSelected={field.value || []}
                    onChange={field.onChange}
                    value={field.value || []}
                  />
                )}
              />

              {formState.errors.relatedArticles && (
                <p className="text-sm text-red-500">
                  {formState.errors.relatedArticles.message as string}
                </p>
              )}
            </div>

            {/* Status always pending */}
            <input
              type="hidden"
              value="pending"
              {...createBlogForm.register("status")}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isLoading}
              onClick={createBlogForm.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
