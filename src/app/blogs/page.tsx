"use client";

import { useAuthContext } from "@/contexts";
import BlogsPage from "./components/ViewBlogs";
import Link from "next/link";

const BlogListPage = () => {
  const { user } = useAuthContext();
  return (
    <section className="pt-4 pb-8 lg:pt-8 lg:pb-12 px-4">
      <div className="flex flex-col gap-4">
        {user?.role === "admin" && (
          <div className="flex justify-end">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              href="/blogs/components/create-blog"
            >
              + Add Blog
            </Link>
          </div>
        )}
        <BlogsPage />
      </div>
    </section>
  );
};

export default BlogListPage;
