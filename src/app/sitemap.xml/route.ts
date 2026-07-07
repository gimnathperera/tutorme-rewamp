import { NextResponse } from "next/server";
import { fetchSeoBlogs, getBlogPath } from "@/lib/seo-data";
import { getCanonicalUrl } from "@/lib/seo";
import { locales } from "@/i18n/config";

export const revalidate = 3600;

type SitemapEntry = {
  url: string;
  lastModified: Date;
  priority: number;
  alternates: Record<string, string>;
};

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/request-for-tutors", priority: 0.8 },
  { path: "/request-for-tutors/create-request", priority: 0.7 },
  { path: "/register-tutor", priority: 0.8 },
  { path: "/find-a-tutor", priority: 0.8 },
  { path: "/grades-and-subjects", priority: 0.8 },
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

const buildAlternates = (path: string) =>
  Object.fromEntries(
    locales.map((locale) => [locale, getCanonicalUrl(path, locale)]),
  );

async function buildSitemapEntries(): Promise<SitemapEntry[]> {
  const now = new Date();

  const staticEntries = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: getCanonicalUrl(route.path, locale),
      lastModified: now,
      priority: route.priority,
      alternates: buildAlternates(route.path),
    })),
  );

  const blogs = await fetchSeoBlogs();
  const blogEntries = blogs
    .filter((blog) => !blog.status || blog.status === "approved")
    .flatMap((blog) => {
      const path = getBlogPath(blog);
      const lastModified = toDate(blog.updatedAt || blog.createdAt);

      return locales.map((locale) => ({
        url: getCanonicalUrl(path, locale),
        lastModified,
        priority: 0.6,
        alternates: buildAlternates(path),
      }));
    });

  return [...staticEntries, ...blogEntries];
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function toXml(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) => {
      const alternateLinks = Object.entries(entry.alternates)
        .map(
          ([locale, href]) =>
            `<xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(href)}" />`,
        )
        .join("\n");

      return [
        "<url>",
        `<loc>${escapeXml(entry.url)}</loc>`,
        alternateLinks,
        `<lastmod>${entry.lastModified.toISOString()}</lastmod>`,
        "<changefreq>weekly</changefreq>",
        `<priority>${entry.priority}</priority>`,
        "</url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    "</urlset>",
  ].join("\n");
}

export async function GET() {
  const entries = await buildSitemapEntries();

  return new NextResponse(toXml(entries), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
