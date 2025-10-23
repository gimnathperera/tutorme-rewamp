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
import { Button } from "@/components/ui/button";

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
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  if (isLoading) return <p>Loading...</p>;
  if (error || !blog) return <p>Blog not found.</p>;

  // Extract content parts
  const paragraph = blog.content.find((c) => c.type === "paragraph");
  const heading = blog.content.find((c) => c.type === "heading");
  const image = blog.content.find((c) => c.type === "image");

  // Related articles
  const relatedArticles =
    allBlogs?.results.filter((b) =>
      blog.relatedArticles?.some((ra) => ra.id === b.id)
    ) ||
    blog.relatedArticles ||
    [];

  // Tag colors
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
    <>
      <div className="m-10">
        {blog.author?.name === user?.name && (
          <div className="flex flex-row justify-end items-end my-2">
            <Button className="justify-end text-xl font-semibold text-white  py-6 px-6 lg:px-12  rounded-full  bg-primary-700 hover:bg-btnblue">
              <Link
                href={`/blogs/components/edit-blog/${blog.id}`}
                className=""
              >
                Edit Blog
              </Link>
            </Button>
          </div>
        )}
        {image?.src && (
          <div className="relative w-full mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={image.src}
              alt={image.caption || "Cover Image"}
              className="w-full h-[350px] md:h-[450px] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                {blog.title || "Untitled Blog"}
              </h1>
              {heading?.text && (
                <p className="text-lg md:text-xl text-gray-200 mt-3 max-w-3xl italic">
                  {heading.text}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content + Sidebar */}
      <div className="flex flex-col m-10 lg:flex-row xl:flex-row md:flex-row gap-6 mt-6">
        {/* Left Column */}
        <div className="flex-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6 transition-all">
          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm transition-transform hover:scale-105">
            <Avatar>
              <AvatarImage src={blog.author?.avatar} />
              <AvatarFallback>{blog.author?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{blog.author?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {blog.author?.role} •{" "}
                {new Date(blog.createdAt).toLocaleDateString()}{" "}
                {new Date(blog.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {blog.tags?.map((t: any, idx: number) => (
              <span
                key={t.id}
                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition transform hover:-translate-y-1 hover:scale-105 ${
                  tagColors[idx % tagColors.length]
                }`}
              >
                {t.name}
              </span>
            ))}
          </div>
          <div></div>
          <div>
            <img
              className="rounded-lg mb-2 max-h-[400px] w-full object-cover"
              src={blog.image}
              alt={"Blog Image"}
            />
          </div>
          {/* Table of Contents */}
          <TableOfContents html={decodeHtml(paragraph?.text || "")} />

          {/* Blog Body */}
          <div
            className="blog-content max-w-none text-justify mt-6 prose dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: decodeHtml(
                paragraph?.text || "<p>Nothing to preview yet...</p>"
              ),
            }}
          />
        </div>

        {/* Right Column: Related Articles */}
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
                      src={related.image || "/placeholder.png"}
                      alt="thumbnail"
                      className="w-16 h-16 rounded-md object-cover"
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
          {/* FAQ Accordion Section */}
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
    </>
  );
}
