import { fetchSeoBlogBySlugOrId } from "@/lib/seo-data";
import BlogDetailClient from "./BlogDetailClient";

type BlogDetailPageProps = {
  params: { slug: string; locale: string };
};

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const initialBlog = await fetchSeoBlogBySlugOrId(params.slug);

  return (
    <BlogDetailClient slug={params.slug} initialBlog={initialBlog ?? null} />
  );
}
