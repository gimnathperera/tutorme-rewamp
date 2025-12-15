"use client";

import { useState, useMemo, useEffect } from "react";
import { useFetchBlogsQuery } from "@/store/api/splits/blogs";
import { useFetchTagsQuery } from "@/store/api/splits/tabs";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function BlogsDashboard() {
  const [page, setPage] = useState(1);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const pageSize = 9;
  const router = useRouter();

  const {
    data: allBlogsData,
    isLoading: isBlogsLoading,
    isError: isBlogsError,
  } = useFetchBlogsQuery({ limit: 9999 });

  const { data: tagsData, isLoading: isTagsLoading } = useFetchTagsQuery({});

  const allBlogsRaw = allBlogsData?.results || [];
  const tags = tagsData?.results || [];

  const allBlogs = useMemo(() => {
    return [...allBlogsRaw].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [allBlogsRaw]);

  const filteredAllBlogs = useMemo(() => {
    if (!activeTag) return allBlogs;
    return allBlogs.filter((blog) =>
      blog.tags?.some((t: any) => t.id === activeTag)
    );
  }, [activeTag, allBlogs]);

  const startIndex = (page - 1) * pageSize;
  const paginatedFilteredBlogs = filteredAllBlogs.slice(
    startIndex,
    startIndex + pageSize
  );

  const totalPages = Math.ceil(filteredAllBlogs.length / pageSize);

  useEffect(() => {
    setPage(1);
  }, [activeTag]);

  const recentArticles = allBlogs.slice(0, 5);

  if (isBlogsLoading || isTagsLoading)
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-6 w-60 rounded-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[250px] w-[250px] rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (isBlogsError)
    return (
      <div className="text-red-500 py-10 text-center">Failed to load blogs</div>
    );

  return (
    <div className="p-6 flex flex-col md:flex-row gap-8">
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative h-52 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white p-10 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Welcome to the Tuition Lanka
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Discover the latest insights and updates.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            onClick={() => setActiveTag(null)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-all duration-200 ${
              !activeTag
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            All
          </Button>

          {tags.map((tag) => (
            <Button
              key={tag.id}
              size="sm"
              onClick={() => setActiveTag(tag.id)}
              className={`rounded-full px-4 py-1 text-sm font-medium transition-all duration-200 ${
                activeTag === tag.id
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-gray-200 text-gray-800 hover:bg-blue-100"
              }`}
            >
              {tag.name}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedFilteredBlogs.map((blog) => {
            const imageSrc =
              blog.image || blog.content.find((c) => c.type === "image")?.src;
            const blogDate = new Date(blog.createdAt);

            return (
              <Card
                key={blog.id}
                onClick={() => router.push(`/blogs/${blog.id}`)}
                className="bg-white dark:bg-gray-800 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {imageSrc && (
                  <div className="relative">
                    <img
                      src={imageSrc}
                      alt={blog.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-xs font-semibold px-2 py-1 rounded shadow">
                      {blogDate.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                )}

                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={blog.author.avatar || "/placeholder.png"}
                      alt={blog.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">{blog.author.name}</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {blog.author.role}
                      </span>
                    </div>
                  </div>

                  <CardTitle className="text-lg font-semibold">
                    {blog.title}
                  </CardTitle>

                  {blog.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {blog.tags.map((t: any) => (
                        <span
                          key={t.id}
                          className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {paginatedFilteredBlogs.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No blogs found for this tag.
            </p>
          )}
        </div>
        {totalPages > 1 && (
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
        )}
      </div>
      <aside className="w-full md:w-[20%] flex flex-col gap-6">
        <h3 className="text-xl font-semibold border-b pb-2">Recent Articles</h3>
        <div className="flex flex-col gap-4">
          {recentArticles.map((blog) => (
            <div
              key={blog.id}
              onClick={() => router.push(`/blogs/${blog.id}`)}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition"
            >
              <img
                src={blog.image || "/placeholder.png"}
                alt={blog.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex flex-col">
                <p className="font-medium">{blog.title}</p>
                <p className="text-xs text-gray-500">{blog.author.name}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
