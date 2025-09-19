"use client";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { AddBlog } from "./components/create-blog/page";
import BlogsPage from "./components/ViewBlogs";

type Blog = {
  id: string;
  date: string;
  CardTitle: string;
  CardDescription: string;
  image: string;
};

const BlogCard: FC<Blog> = ({
  id,
  image,
  date,
  CardTitle,
  CardDescription,
}) => {
  const router = useRouter();

  const onHandleBlogClick = () => {
    router.push(`/blogs/${id}`);
  };

  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3" onClick={onHandleBlogClick}>
      <div className="mb-10 w-full cursor-pointer">
        <div className="mb-8 overflow-hidden rounded">
          <img src={image} alt="" className="w-full" />
        </div>
        <div>
          {date && (
            <span className="mb-5 inline-block rounded bg-primary-700 px-4 py-1 text-center text-xs font-semibold leading-loose text-white">
              {date}
            </span>
          )}
          <h3>
            <span className="cursor-pointer mb-4 inline-block text-xl font-semibold text-dark hover:text-blue sm:text-2xl lg:text-xl xl:text-2xl">
              {CardTitle}
            </span>
          </h3>
          <p className="text-base text-body-color dark:text-dark-6">
            {CardDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

const BlogListPage = () => {
  return (
    <section className="pt-8 pb-16 lg:pt-16 lg:pb-24 px-4 sm:px-8 md:px-16 lg:px-32 mb-8">
      <div className="container">
        <div>
          <AddBlog />
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
