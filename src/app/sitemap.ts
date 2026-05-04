import type { MetadataRoute } from "next";
import { fetchSeoBlogs, getBlogPath } from "@/lib/seo-data";
import { getCanonicalUrl } from "@/lib/seo";

export const revalidate = 3600;

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/request-for-tutors", priority: 0.8 },
  { path: "/request-for-tutors/create-request", priority: 0.7 },
  { path: "/register-tutor", priority: 0.8 },
  { path: "/find-a-tutor", priority: 0.8 },
  { path: "/tuition-assignments", priority: 0.8 },
  { path: "/grades-and-subjects", priority: 0.8 },
  { path: "/level-and-exams", priority: 0.8 },
  { path: "/past-exam-papers", priority: 0.8 },
  { path: "/tuition-rates", priority: 0.8 },
  { path: "/faq", priority: 0.6 },
  { path: "/blogs", priority: 0.7 },
  { path: "/contact-us", priority: 0.6 },
  { path: "/privacy-policy", priority: 0.3 },
  { path: "/terms-and-conditions", priority: 0.3 },
];

const toDate = (value?: string) => {
  if (!value) return new Date();
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = staticRoutes.map((route) => ({
    url: getCanonicalUrl(route.path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));

  const blogs = await fetchSeoBlogs();
  const blogEntries = blogs
    .filter((blog) => !blog.status || blog.status === "approved")
    .map((blog) => ({
      url: getCanonicalUrl(getBlogPath(blog)),
      lastModified: toDate(blog.updatedAt || blog.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...blogEntries];
}
