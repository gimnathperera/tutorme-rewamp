import { env } from "@/configs/env";
import { defaultImage } from "@/lib/seo";
import type { Blogs, Faq, PaginatedResponse } from "@/types/response-types";

const BLOG_LIMIT = 9999;
const FAQ_LIMIT = 9999;

const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || env.urls.apiUrl || "";

const decodeEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

export const getPlainText = (value?: string | null) =>
  decodeEntities(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildApiUrl = (
  path: string,
  params?: Record<string, string | number>,
) => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return null;

  const url = new URL(path, baseUrl);
  Object.entries(params || {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
};

async function fetchSeoJson<T>(
  path: string,
  params?: Record<string, string | number>,
) {
  const url = buildApiUrl(path, params);
  if (!url) return null;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchSeoBlogs() {
  const data = await fetchSeoJson<PaginatedResponse<Blogs>>("/v1/blogs", {
    page: 1,
    limit: BLOG_LIMIT,
  });

  return data?.results || [];
}

export async function fetchSeoFaqs() {
  const data = await fetchSeoJson<PaginatedResponse<Faq>>("/v1/faqs", {
    page: 1,
    limit: FAQ_LIMIT,
  });

  return data?.results || [];
}

export async function fetchSeoBlogBySlugOrId(slugOrId: string) {
  const path = isObjectId(slugOrId)
    ? `/v1/blogs/${slugOrId}`
    : `/v1/blogs/slug/${slugOrId}`;

  return fetchSeoJson<Blogs>(path);
}

export function getBlogPath(blog: Pick<Blogs, "id" | "slug">) {
  return `/blogs/${blog.slug || blog.id}`;
}

export function getBlogImage(blog?: Pick<Blogs, "image" | "content"> | null) {
  const contentImage = blog?.content?.find(
    (block): block is { type: "image"; src: string; caption?: string } =>
      block.type === "image" && Boolean(block.src),
  );

  return blog?.image || contentImage?.src || defaultImage;
}

export function getBlogDescription(
  blog?: Pick<Blogs, "description" | "content"> | null,
) {
  const contentParagraph = blog?.content?.find(
    (block): block is { type: "paragraph"; text: string } =>
      block.type === "paragraph" && Boolean(block.text?.trim()),
  );
  const description = getPlainText(blog?.description || contentParagraph?.text);

  return (
    description ||
    "Read Tuition Lanka education articles with practical study tips, exam guides, and tutor advice for Sri Lankan students and parents."
  );
}

export function toMetaDescription(description: string) {
  if (description.length <= 160) return description;

  return `${description.slice(0, 157).trim()}...`;
}
