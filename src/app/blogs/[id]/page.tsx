"use client";

import { useParams } from "next/navigation";
import {
  useFetchBlogByIdQuery,
  useFetchBlogsQuery,
} from "@/store/api/splits/blogs";
import { useAuthContext } from "@/contexts";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TableOfContents from "../components/table-of-content/TableOfContent";
import { useEffect, useState } from "react";
import BlogRenderer from "../components/blog-renderer/BlogRenderer";

import LoadingIndicator from "./LoadingIndicator";

export default function ViewBlogPage() {
  const params = useParams();
  const blogId = params?.id as string;
  const { data: blog, isLoading, error } = useFetchBlogByIdQuery(blogId);
  const { data: allBlogs } = useFetchBlogsQuery({});
  const { user } = useAuthContext();

  const [openFaqs, setOpenFaqs] = useState<boolean[]>([]);

  useEffect(() => {
    if (blog?.faqs?.length) {
      setOpenFaqs(blog.faqs.map(() => false));
    }
  }, [blog]);

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen)),
    );
  };

  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  if (isLoading) return <LoadingIndicator />;
  if (error || !blog) return <p>Blog not found.</p>;

  const relatedArticles =
    allBlogs?.results.filter((b) =>
      blog.relatedArticles?.some((ra) => ra.id === b.id),
    ) ||
    blog.relatedArticles ||
    [];

  const tagColors = [
    "bg-red-100 text-red-800",
    "bg-green-100 text-green-800",
    "bg-blue-100 text-blue-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-teal-100 text-teal-800",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        {blog.author?.name === user?.name && (
          <div className="flex justify-end mb-4">
            <Link
              href={`/blogs/components/edit-blog/${blog.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              ✏️ Edit Blog
            </Link>
          </div>
        )}
        {blog.image && (
          <div className="relative w-full mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={blog.image}
              alt={blog.title || "Cover Image"}
              className="w-full h-[250px] md:h-[350px] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                {blog.title || "Untitled Blog"}
              </h1>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-12">
        <div className="flex-1 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 transition-all overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed">
            <div className="flex items-center gap-5 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border dark:border-gray-700">
              <Avatar className="h-14 w-14 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                <AvatarImage
                  src={blog.author?.avatar || "/images/profile/pp.png"}
                />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xl uppercase">
                  {blog.author?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-xl text-gray-900 dark:text-gray-100">
                  {blog.author?.name}
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {blog.author?.role} •{" "}
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {blog.tags?.map((t: any, idx: number) => (
                <span
                  key={t.id}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition transform hover:-translate-y-0.5 ${
                    tagColors[idx % tagColors.length]
                  }`}
                >
                  {t.name}
                </span>
              ))}
            </div>

            <div className="border-y py-8 dark:border-gray-700">
              <TableOfContents
                html={
                  blog.content
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
            </div>

            <div className="mt-10 blog-renderer-wrapper">
              <BlogRenderer content={blog.content} />
            </div>
          </div>
        </div>

        <aside className="w-full md:w-[30%] flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-semibold border-b pb-2">
              Related Articles
            </h3>
            <ul className="space-y-4">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((related: any, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg shadow-sm transition-transform hover:scale-105 cursor-pointer bg-white dark:bg-gray-800"
                    onClick={() =>
                      (window.location.href = `/blogs/${related.id}`)
                    }
                  >
                    <img
                      src={related.image || "/images/profile/pp.png"}
                      alt="thumbnail"
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/profile/pp.png";
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:underline">
                        {related.title || "Untitled Post"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {related.author?.name || "Unknown Author"}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No related posts selected.
                </p>
              )}
            </ul>
          </div>
          {blog.faqs?.length > 0 && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">FAQs</h3>
              <div className="space-y-2">
                {blog.faqs.map((faq: any, idx: number) => (
                  <div key={idx} className="border-b last:border-b-0 pb-2">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left flex justify-between items-center py-2 font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 transition"
                    >
                      <span>{faq.question}</span>
                      <span className="ml-2 transform transition-transform duration-300">
                        {openFaqs[idx] ? "▲" : "▼"}
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaqs[idx] ? "max-h-96 mt-1" : "max-h-0"
                      }`}
                    >
                      <p className="text-gray-700 dark:text-gray-400 mt-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
