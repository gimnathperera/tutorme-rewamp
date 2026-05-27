"use client";

import WhatsAppButton from "@/components/shared/whatapp-button";
import BlogsPage from "./components/ViewBlogs";

const BlogListPage = () => {
  return (
    <div className="mx-auto max-w-7xl mt-10 px-6 lg:px-8 pb-10">
      <BlogsPage />
      <WhatsAppButton />
    </div>
  );
};

export default BlogListPage;
