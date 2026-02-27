"use client";

import { useState, useMemo, useEffect } from "react";
import { useFetchBlogsQuery } from "@/store/api/splits/blogs";
import { useFetchTagsQuery } from "@/store/api/splits/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DefaultAvatar from "../../../../public/images/profile/pp.png";

const DEFAULT_AVATAR = "/images/profile/pp.png";

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
  const tags = tagsData?.results || [];

  const allBlogs = useMemo(() => {
    const blogs = allBlogsData?.results ?? [];
    return [...blogs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [allBlogsData]);

  const filteredAllBlogs = useMemo(() => {
    if (!activeTag) return allBlogs;
    return allBlogs.filter((blog) =>
      blog.tags?.some((t: any) => t.id === activeTag),
    );
  }, [activeTag, allBlogs]);

  const startIndex = (page - 1) * pageSize;
  const paginatedFilteredBlogs = filteredAllBlogs.slice(
    startIndex,
    startIndex + pageSize,
  );

  const totalPages = Math.ceil(filteredAllBlogs.length / pageSize);

  useEffect(() => {
    setPage(1);
  }, [activeTag]);

  const recentArticles = allBlogs.slice(0, 5);

  if (isBlogsLoading || isTagsLoading)
    return (
      <div className="p-6 flex flex-col gap-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (isBlogsError)
    return (
      <div className="text-red-500 py-10 text-center text-sm">
        Failed to load blogs. Please try again later.
      </div>
    );

  return (
    <div className="p-4 lg:p-6 flex flex-col lg:flex-row gap-8">
      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">

        {/* Hero banner */}
        <div className="relative h-44 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white px-8 py-6 flex flex-col justify-center overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
              TuitionLanka Insights
            </p>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              Welcome to the Tuition Lanka Blog
            </h1>
            <p className="text-sm md:text-base text-white/80 mt-1">
              Discover the latest insights, tips, and updates.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
        </div>

        {/* Tag filter pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${!activeTag
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${activeTag === tag.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* Blog grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {paginatedFilteredBlogs.map((blog) => {
            const imageSrc =
              blog.image || blog.content.find((c) => c.type === "image")?.src;
            const blogDate = new Date(blog.createdAt);
            const avatarSrc = blog.author.avatar || DEFAULT_AVATAR;

            return (
              <article
                key={blog.id}
                onClick={() => router.push(`/blogs/${blog.id}`)}
                className="group bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-250 overflow-hidden flex flex-col"
              >
                {/* Cover image */}
                {imageSrc ? (
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm">
                      {blogDate.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                )}

                {/* Card body */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  {/* Author row */}
                  <div className="flex items-center gap-2.5">
                    <img
                      src={avatarSrc}
                      alt={blog.author.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                    />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-semibold text-gray-800">
                        {blog.author.name}
                      </span>
                      <span className="text-[10px] text-gray-400 capitalize">
                        {blog.author.role}
                      </span>
                    </div>
                    {!imageSrc && (
                      <span className="ml-auto text-[10px] text-gray-400">
                        {blogDate.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h2>

                  {/* Tags */}
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {blog.tags.slice(0, 3).map((t: any) => (
                        <span
                          key={t.id}
                          className="inline-block bg-blue-50 text-blue-700 text-[10px] font-medium px-2 py-0.5 rounded-full"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}

          {paginatedFilteredBlogs.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-gray-400">
              No blogs found for this tag.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-500 px-2">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ── Sidebar ── */}
      <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
            Recent Articles
          </h3>
          <div className="flex flex-col gap-3">
            {recentArticles.map((blog) => (
              <div
                key={blog.id}
                onClick={() => router.push(`/blogs/${blog.id}`)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-400 text-xs font-bold">
                      {blog.title[0]}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2 transition-colors">
                    {blog.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {blog.author.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
