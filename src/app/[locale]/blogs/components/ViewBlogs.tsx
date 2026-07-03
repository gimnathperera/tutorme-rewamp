"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLazyFetchBlogsQuery } from "@/store/api/splits/blogs";
import { useFetchTagsQuery } from "@/store/api/splits/tabs";
import { useTranslateItems } from "@/hooks/useTranslateItems";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/contexts";
import { Link } from "@/navigation";
import Image from "next/image";
import { Blogs } from "@/types/response-types";

const DEFAULT_AVATAR = "/images/logo/LightThemeLogoIcon.svg";
const SERVER_LIMIT = 12;

const getPageSize = (): number => {
  if (typeof window === "undefined") return 6;
  return window.innerWidth >= 768 ? 6 : 4;
};

export default function BlogsDashboard({
  initialBlogs = [],
}: {
  initialBlogs?: Blogs[];
}) {
  const t = useTranslations("blogs");
  const [blogs, setBlogs] = useState<Blogs[]>(initialBlogs);
  const [serverPage, setServerPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(
    initialBlogs.length === 0,
  );
  const [isFiltering, setIsFiltering] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const isFirstRender = useRef(true);
  const hasRenderedOnceRef = useRef(initialBlogs.length > 0);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(6);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
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
    async (pageNum: number, filtering = false) => {
      try {
        if (pageNum === 1) {
          if (filtering) {
            setIsFiltering(true);
          } else if (!hasRenderedOnceRef.current) {
            // Only show the full skeleton if we truly have nothing on screen
            // yet. If SSR already seeded `initialBlogs`, do a silent
            // background refresh instead of blanking out real content.
            setIsInitialLoading(true);
          }
          setIsError(false);
        } else {
          setIsFetchingMore(true);
        }

        const result = await fetchBlogs({
          limit: SERVER_LIMIT,
          page: pageNum,
          sortBy: "createdAt:desc",
        });

        if (result.data) {
          const newBlogs = result.data.results as Blogs[];
          setBlogs((prev) =>
            pageNum === 1 ? newBlogs : [...prev, ...newBlogs],
          );
          const totalPages = (result.data as any).totalPages ?? 1;
          setHasMore(pageNum < totalPages);
        } else {
          if (pageNum === 1) setIsError(true);
        }
      } finally {
        setIsInitialLoading(false);
        setIsFiltering(false);
        setIsFetchingMore(false);
        hasRenderedOnceRef.current = true;
      }
    },
    [fetchBlogs],
  );

  useEffect(() => {
    const isMount = isFirstRender.current;
    isFirstRender.current = false;

    // On the very first mount, if SSR already seeded real blogs, keep them
    // visible and refresh in the background instead of clearing first (which
    // would otherwise flash the grid to empty before the fetch resolves).
    if (isMount && hasRenderedOnceRef.current) {
      loadBlogs(1, false);
      return;
    }

    setServerPage(1);
    setBlogs([]);
    setHasMore(true);
    loadBlogs(1, !isMount);
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

  // Translate blog titles and tag names for non-English locales
  const translatedVisibleBlogs = useTranslateItems(
    visibleBlogs,
    (blog) => [blog.title],
    (blog, [title]) => ({ ...blog, title: title ?? blog.title }),
  );

  const translatedTags = useTranslateItems(
    tags,
    (tag) => [tag.name],
    (tag, [name]) => ({ ...tag, name: name ?? tag.name }),
  );

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

  // Tags load client-side only; don't let them block showing SSR-seeded
  // blog content (which must be present in the server-rendered HTML for
  // crawlers). Only show the full skeleton when there are no blogs to show.
  if ((isInitialLoading || isTagsLoading) && blogs.length === 0)
    return (
      <div className="flex flex-col gap-6">
        {/* Hero banner skeleton */}
        <div className="relative min-h-44 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-5 sm:px-8 py-6 flex flex-col justify-center overflow-hidden">
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
          <div className="h-8 w-14 rounded-full bg-blue-600" />
          <Skeleton className="h-8 w-24 rounded-full bg-bggrey" />
          <Skeleton className="h-8 w-24 rounded-full bg-bggrey" />
          <Skeleton className="h-8 w-24 rounded-full bg-bggrey" />
          <Skeleton className="h-8 w-16 rounded-full bg-bggrey" />
          <Skeleton className="h-8 w-20 rounded-full bg-bggrey" />
        </div>

        {/* Blog card skeletons */}
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
            >
              <div className="relative h-44 bg-gray-200 overflow-hidden">
                <Skeleton className="absolute inset-0 rounded-none bg-gray-200" />
                <Skeleton className="absolute bottom-2.5 right-2.5 h-6 w-20 rounded-md bg-gray-300" />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-7 w-7 rounded-full shrink-0 bg-gray-200" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-24 rounded bg-gray-200" />
                  </div>
                </div>
                <hr className="border-gray-100" />
                <Skeleton className="h-4 w-full rounded bg-gray-200" />
                <Skeleton className="h-4 w-3/4 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 py-10 text-center text-sm">
        {t("failedToLoad")}
      </div>
    );

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-7">
        <div className="flex-1 flex flex-col gap-6 lg:gap-7 min-w-0">
          {/* Hero banner */}
          <div className="relative min-h-44 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white px-5 sm:px-8 py-6 flex flex-col justify-center overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
                {t("heroLabel")}
              </p>
              <h1 className="text-2xl sm:text-3xl text-white font-bold leading-tight">
                {t("heroTitle")}
              </h1>
              <p className="text-sm md:text-base text-white/80 mt-1">
                {t("heroSubtitle")}
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
                  {t("addBlog")}
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
              {t("allFilter")}
            </button>
            {translatedTags.map((tag) => (
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
          {isFiltering ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative h-44 bg-bggrey overflow-hidden">
                    <Skeleton className="absolute inset-0 rounded-none bg-bggrey" />
                    <Skeleton className="absolute bottom-2.5 right-2.5 h-6 w-20 rounded-md bg-linegrey" />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-7 w-7 rounded-full shrink-0 bg-bggrey" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-24 rounded bg-bggrey" />
                      </div>
                    </div>
                    <hr className="border-bggrey" />
                    <Skeleton className="h-4 w-full rounded bg-bggrey" />
                    <Skeleton className="h-4 w-3/4 rounded bg-bggrey" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {translatedVisibleBlogs.map((blog, index) => {
                const imageSrc = blog.image;
                const blogDate = new Date(blog.createdAt);

                return (
                  <Link
                    key={blog.id}
                    href={`/blogs/${blog.slug || blog.id}`}
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
                            {t("authorName")}
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
                              ? t("statusApproved")
                              : (blog as any).status === "pending"
                                ? t("statusPending")
                                : t("statusRejected")}
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
                  </Link>
                );
              })}

              {visibleBlogs.length === 0 && !hasMore && (
                <p className="col-span-full py-10 text-center text-sm text-gray-400">
                  {t("noBlogsFound")}
                </p>
              )}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {hasMoreToShow && <div ref={sentinelRef} className="h-4" />}

          {/* Skeleton cards while fetching next server page */}
          {isFetchingMore && (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative h-44 bg-bggrey overflow-hidden">
                    <Skeleton className="absolute inset-0 rounded-none bg-bggrey" />
                    <Skeleton className="absolute bottom-2.5 right-2.5 h-6 w-20 rounded-md bg-linegrey" />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-7 w-7 rounded-full shrink-0 bg-bggrey" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-24 rounded bg-bggrey" />
                      </div>
                    </div>
                    <hr className="border-bggrey" />
                    <Skeleton className="h-4 w-full rounded bg-bggrey" />
                    <Skeleton className="h-4 w-3/4 rounded bg-bggrey" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button - mobile/tablet only */}
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
          {t("addBlogMobile")}
        </Link>
      )}
    </>
  );
}
