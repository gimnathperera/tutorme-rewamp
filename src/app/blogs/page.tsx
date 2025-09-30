"use client";

import BlogsPage from "./components/ViewBlogs";
import Link from "next/link";

const BlogListPage = () => {
  return (
    <section className="pt-8 pb-16 lg:pt-16 lg:pb-24 px-4 sm:px-8 md:px-16 lg:px-32 mb-8">
      <div className="container">
        <div className="flex justify-end items-end">
          <Link
            className="bg-black text-white py-4 px-8 rounded-lg font-semibold"
            href={"/blogs/components/create-blog"}
          >
            Add Blog
          </Link>
        </div>
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
              <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40px]">
                Our Recent News
              </h2>
              <p className="text-base text-body-color dark:text-dark-6">
                There are many variations of passages of Lorem Ipsum available
                but the majority have suffered alteration in some form.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <BlogsPage />
        </div>
      </div>
    </section>
  );
};

export default BlogListPage;
