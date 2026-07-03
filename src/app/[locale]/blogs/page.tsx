import WhatsAppButton from "@/components/shared/whatapp-button";
import BlogsPage from "./components/ViewBlogs";
import { fetchSeoBlogs } from "@/lib/seo-data";

const SSR_PAGE_SIZE = 6;

const BlogListPage = async () => {
  const allBlogs = await fetchSeoBlogs();
  const initialBlogs = allBlogs
    .filter((blog) => !blog.status || blog.status === "approved")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, SSR_PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl mt-10 px-6 lg:px-8 pb-10">
      <BlogsPage initialBlogs={initialBlogs} />
      <WhatsAppButton />
    </div>
  );
};

export default BlogListPage;
