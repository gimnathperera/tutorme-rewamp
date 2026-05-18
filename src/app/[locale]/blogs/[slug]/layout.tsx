import type { Metadata } from "next";
import JsonLd from "@/components/seo/json-ld";
import {
  createArticleJsonLd,
  createBreadcrumbJsonLd,
  createMetadata,
  seoPages,
} from "@/lib/seo";
import {
  fetchSeoBlogBySlugOrId,
  getBlogDescription,
  getBlogImage,
  getBlogPath,
  toMetaDescription,
} from "@/lib/seo-data";

type BlogDetailLayoutProps = {
  children: React.ReactNode;
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = await fetchSeoBlogBySlugOrId(params.slug);

  if (blog) {
    const description = toMetaDescription(getBlogDescription(blog));

    return createMetadata({
      title: `${blog.title} | Tuition Lanka`,
      description,
      path: getBlogPath(blog),
      image: getBlogImage(blog),
      imageAlt: blog.title,
    });
  }

  return createMetadata({
    ...seoPages.blogs,
    title: "Study Tips and Exam Preparation Article | Tuition Lanka",
    description:
      "Read Tuition Lanka education articles with practical study tips, exam guides, and tutor advice for students, parents, and home tutors in Sri Lanka.",
    path: `/blogs/${params.slug}`,
  });
}

export default async function BlogDetailLayout({
  children,
  params,
}: BlogDetailLayoutProps) {
  const blog = await fetchSeoBlogBySlugOrId(params.slug);
  const blogPath = blog ? getBlogPath(blog) : `/blogs/${params.slug}`;
  const title = blog?.title || "Blog Article";
  const description = blog
    ? toMetaDescription(getBlogDescription(blog))
    : seoPages.blogs.description;

  return (
    <>
      <JsonLd
        data={[
          ...(blog
            ? [
                createArticleJsonLd({
                  headline: blog.title,
                  description,
                  image: getBlogImage(blog),
                  datePublished: blog.createdAt,
                  dateModified: blog.updatedAt,
                  path: blogPath,
                }),
              ]
            : []),
          createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blogs", path: seoPages.blogs.path },
            { name: title, path: blogPath },
          ]),
        ]}
      />
      {children}
    </>
  );
}
