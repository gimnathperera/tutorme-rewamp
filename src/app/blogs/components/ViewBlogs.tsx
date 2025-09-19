"use client";

import { useState } from "react";
import { useFetchBlogsQuery } from "@/store/api/splits/blogs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const router = useRouter();
  const { data, isLoading, isError } = useFetchBlogsQuery({
    page,
    limit: pageSize,
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 py-10 text-center">Failed to load blogs</div>
    );

  const blogs = data?.results || [];
  const totalPages = Math.ceil((data?.totalResults || 0) / pageSize);

  return (
    <div className=" mx-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {blogs.map((blog) => {
          const paragraph =
            blog.content.find((c) => c.type === "paragraph")?.text || "";
          const imageSrc =
            blog.image || blog.content.find((c) => c.type === "image")?.src;

          return (
            <Card
              key={blog.id}
              onClick={() => {
                router.push(`/blogs/${blog.id}`);
              }}
              className="bg-white dark:bg-gray-800 shadow-md"
            >
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
                <CardDescription>
                  {blog.author.name} - {blog.author.role}
                  <p className="text-sm text-gray-500">
                    Created at: {new Date(blog.createdAt).toLocaleDateString()},{" "}
                    {new Date(blog.createdAt).toLocaleTimeString()}
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={blog.title}
                    className="mt-2 rounded-md w-full h-40 object-cover"
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination Part is below here */}
      <div className="flex justify-center gap-2 mt-8">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="flex items-center px-4">
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
