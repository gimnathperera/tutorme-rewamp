"use client";

import { useAuthContext } from "@/contexts";
import BlogsPage from "./components/ViewBlogs";
import Link from "next/link";

const BlogListPage = () => {
  const { user } = useAuthContext();
  return (
    <section className="pt-4 pb-8 lg:pt-8 lg:pb-12 px-4 mb-8">
      <div className="flex flex-col">
        {user?.role == "admin" ? (
          <div className="flex justify-end items-end">
            <Link
              className="justify-end text-xl font-semibold text-white  py-4 px-6 lg:px-12  rounded-full  bg-primary-700 hover:bg-btnblue"
              href={"/blogs/components/create-blog"}
            >
              Add Blog
            </Link>
          </div>
        ) : (
          <div></div>
        )}
        <div className="">
          <BlogsPage />
        </div>
      </div>
    </section>
  );
};

export default BlogListPage;
