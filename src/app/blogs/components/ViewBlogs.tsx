"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLazyFetchBlogsQuery } from "@/store/api/splits/blogs";
import { useFetchTagsQuery } from "@/store/api/splits/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts";
import Link from "next/link";
import Image from "next/image";
import { Blogs } from "@/types/response-types";
import { Loader2 } from "lucide-react";

const DEFAULT_AVATAR = "/images/logo/LightThemeLogoIcon.svg";
const SERVER_LIMIT = 12;

const getPageSize = (): number => {
  if (typeof window === "undefined") return 6;
  return window.innerWidth >= 768 ? 6 : 4;
};

export default function BlogsDashboard() {
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [serverPage, setServerPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(6);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuthContext();

  const [fetchBlogs] = useLazyFetchBlogsQuery();
  const { data: tagsData, isLoading: isTagsLoading } = useFetchTagsQuery({});
  const tags = tagsData?.results || [];

  useEffect(() => {
    const update = () => setPageSize(getPageSize());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadBlogs = useCallback(
    async (pageNum: number) => {
      try {
        if (pageNum === 1) {
          setIsInitialLoading(true);
          setIsError(false);
        } else {
          setIsFetchingMore(true);
        }

        const result = await fetchBlogs({ limit: SERVER_LIMIT, page: pageNum });

        if (result.data) {
          const newBlogs = result.data.results as Blogs[];
          setBlogs((prev) => (pageNum === 1 ? newBlogs : [...prev, ...newBlogs]));
          const totalPages = (result.data as any).totalPages ?? 1;
          setHasMore(pageNum < totalPages);
        } else {
          if (pageNum === 1) setIsError(true);
        }
      } finally {
        setIsInitialLoading(false);
        setIsFetchingMore(false);
      }
    },
    [fetchBlogs],
  );

  useEffect(() => {
    setServerPage(1);
    setBlogs([]);
    setHasMore(true);
    loadBlogs(1);
  }, [activeTag, loadBlogs]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [pageSize, activeTag]);

  const filteredBlogs = useMemo(() => {
    if (!activeTag) return blogs;
    return blogs.filter((blog) => blog.tags?.some((t) => t.id === activeTag));
  }, [blogs, activeTag]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMoreToShow = visibleCount < filteredBlogs.length || hasMore;

  const handleSentinel = useCallback(() => {
    if (visibleCount < filteredBlogs.length) {
      setVisibleCount((prev) =>
        Math.min(prev + pageSize, filteredBlogs.length),
      );
    } else if (hasMore && !isFetchingMore) {
      const nextPage = serverPage + 1;
      setServerPage(nextPage);
      loadBlogs(nextPage);
    }
  }, [
    visibleCount,
    filteredBlogs.length,
    hasMore,
    isFetchingMore,
    serverPage,
    pageSize,
    loadBlogs,
  ]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMoreToShow) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleSentinel();
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleSentinel, hasMoreToShow]);

  if (isInitialLoading || isTagsLoading)
    return (
      <div className="flex flex-col gap-6">
        {/* Hero banner skeleton */}
        <div className="relative h-44 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-8 py-6 flex flex-col justify-center overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative z-10 flex flex-col gap-3">
            <Skeleton className="h-3 w-40 rounded bg-white/30" />
            <Skeleton className="h-7 w-72 rounded bg-white/30" />
            <Skeleton className="h-4 w-56 rounded bg-white/20" />
          </div>
        </div>

        {/* Tag pills skeleton */}
        <div className="flex flex-wrap gap-4">
          <div className="h-8 px-4 rounded-full bg-blue-600 flex items-center">
            <span className="text-sm font-semibold invisible">All</span>
          </div>
          {["Study Tips", "G.C.E A/L", "G.C.E O/L", "Tutor", "Parents"].map(
            (tag) => (
              <Skeleton key={tag} className="h-8 rounded-full">
                <span className="text-sm font-semibold px-4 invisible">
                  {tag}
                </span>
              </Skeleton>
            ),
          )}
        </div>

        {/* Blog card skeletons */}
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
            >
              <div className="relative h-44 bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M21 12V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75V12"
                  />
                </svg>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
                <hr className="border-gray-100" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <hr className="border-gray-100" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-5/6 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 py-10 text-center text-sm">
        Failed to load blogs. Please try again later.
      </div>
    );

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-7">
        <div className="flex-1 flex flex-col gap-6 lg:gap-7 min-w-0">
          {/* Hero banner */}
          <div className="relative h-44 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white px-8 py-6 flex flex-col justify-center overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
                TuitionLanka Insights
              </p>
              <h1 className="text-3xl text-white md:text-3xl font-bold leading-tight">
                Welcome to the Tuition Lanka Blog
              </h1>
              <p className="text-sm md:text-base text-white/80 mt-1">
                Discover the latest insights, tips, and updates.
              </p>
            </div>
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
            {(user?.role === "admin" || user?.role === "tutor") && (
              <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-10">
                <Link
                  href="/blogs/components/create-blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 px-5 py-2.5 rounded-lg bg-white hover:bg-blue-50 transition-colors duration-200 shadow-sm"
                >
                  + Add Blog
                </Link>
              </div>
            )}
          </div>

          {/* Tag filter pills */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                !activeTag
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
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTag === tag.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>

          {/* Blog grid */}
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {visibleBlogs.map((blog, index) => {
              const imageSrc = blog.image;
              const blogDate = new Date(blog.createdAt);

              return (
                <article
                  key={blog.id}
                  onClick={() => router.push(`/blogs/${blog.slug || blog.id}`)}
                  className="group bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-250 overflow-hidden flex flex-col"
                >
                  {imageSrc ? (
                    <div className="relative h-44 bg-gray-100 overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={blog.title}
                        fill
                        priority={index < 3}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2.5 right-2.5 bg-blue-700 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
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

                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={DEFAULT_AVATAR}
                        alt="Blog post thumbnail"
                        width={28}
                        height={28}
                        priority={index < 3}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-semibold text-gray-800">
                          Tuition Lanka
                        </span>
                      </div>
                      {(user?.role === "admin" ||
                        (blog as any).author?.id === user?.id) && (
                        <span
                          className={[
                            "ml-auto px-2 py-0.5 rounded-full text-xs font-semibold",
                            (blog as any).status === "approved"
                              ? "bg-green-100 text-green-700"
                              : (blog as any).status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700",
                          ].join(" ")}
                        >
                          {(blog as any).status === "approved"
                            ? "Approved"
                            : (blog as any).status === "pending"
                              ? "Pending"
                              : "Rejected"}
                        </span>
                      )}
                      {!imageSrc && (
                        <span className="ml-auto text-xs text-gray-400">
                          {blogDate.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    <hr className="border-gray-100 w-full" />

                    <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h2>
                  </div>
                </article>
              );
            })}

            {visibleBlogs.length === 0 && !hasMore && (
              <p className="col-span-full py-10 text-center text-sm text-gray-400">
                No blogs found for this tag.
              </p>
            )}
          </div>

          {/* Infinite scroll sentinel */}
          {hasMoreToShow && <div ref={sentinelRef} className="h-4" />}

          {/* Spinner while fetching next server page */}
          {isFetchingMore && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button — mobile/tablet only */}
      {(user?.role === "admin" || user?.role === "tutor") && (
        <Link
          href="/blogs/components/create-blog"
          aria-label="Add new blog"
          className={`lg:hidden fixed ${isScrolled ? "bottom-20" : "bottom-6"} right-4 z-50 flex items-center gap-2 px-4 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow-lg shadow-blue-500/40 transition-all duration-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 flex-shrink-0"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Blog
        </Link>
      )}
    </>
  );
}
