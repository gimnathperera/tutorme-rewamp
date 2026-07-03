"use client";

/**
 * useTranslateBlog
 *
 * Translates every text field in a blog object (title, content blocks, FAQs,
 * tag names) into the current locale.
 *
 * - Paragraph blocks contain HTML → translated with format:"html" so Google
 *   Translate preserves tags (bold, links, etc.) and only translates text nodes.
 * - All other fields (headings, list items, captions, quotes…) are translated
 *   as plain text in a single batched request.
 * - Uses the same client-side cache as the rest of the translation pipeline.
 * - Returns the original `blog` object synchronously on the first render so
 *   there is never a blank content flash.
 */

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

// ── Shared client-side cache (locale:format:text → translation) ──────────────
const clientCache = new Map<string, string>();

async function fetchTranslations(
  texts: string[],
  locale: string,
  format: "text" | "html",
): Promise<string[]> {
  if (!texts.length || locale === "en") return texts;

  const results = new Array<string>(texts.length);
  const toFetch: { idx: number; text: string }[] = [];

  texts.forEach((text, idx) => {
    if (!text?.trim()) {
      results[idx] = text ?? "";
      return;
    }
    const key = `${locale}:${format}:${text}`;
    if (clientCache.has(key)) {
      results[idx] = clientCache.get(key)!;
    } else {
      toFetch.push({ idx, text });
    }
  });

  if (toFetch.length === 0) return results;

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: toFetch.map((x) => x.text),
        locale,
        format,
      }),
    });

    if (!response.ok) throw new Error("Translation request failed");

    const { translated } = (await response.json()) as {
      translated: string[];
    };

    toFetch.forEach(({ idx, text }, i) => {
      const result = translated?.[i] ?? text;
      results[idx] = result;
      clientCache.set(`${locale}:${format}:${text}`, result);
    });
  } catch {
    toFetch.forEach(({ idx, text }) => {
      results[idx] = text;
    });
  }

  return results;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Write a value at a dot-separated path inside a mutable object. */
function applyPath(obj: Record<string, unknown>, path: string, value: string) {
  const keys = path.split(".");
  // eslint-disable-next-line
  let cur: any = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur?.[keys[i]];
    if (cur == null) return;
  }
  if (cur != null) cur[keys[keys.length - 1]] = value;
}

interface ContentBlock {
  type: string;
  text?: string;
  level?: number;
  src?: string;
  caption?: string;
  headers?: string[];
  rows?: string[][];
  citation?: string;
  items?: string[];
  style?: string;
  html?: string;
  [key: string]: unknown;
}

interface BlogLike {
  id?: string;
  title?: string;
  content?: ContentBlock[];
  faqs?: { question: string; answer: string; [key: string]: unknown }[];
  tags?: { id: string; name: string; [key: string]: unknown }[];
  [key: string]: unknown;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTranslateBlog<T extends BlogLike>(
  blog: T | undefined,
): T | undefined {
  const locale = useLocale();
  const [translatedBlog, setTranslatedBlog] = useState<T | undefined>(blog);

  const blogRef = useRef<T | undefined>(blog);
  blogRef.current = blog;

  // Stable key: changes only when the actual blog content changes.
  const contentKey = (() => {
    if (!blog || locale === "en") return "";
    return `${locale}:${blog.id ?? ""}:${blog.title ?? ""}:${blog.content?.length ?? 0}:${blog.faqs?.length ?? 0}`;
  })();

  const prevKeyRef = useRef("");

  useEffect(() => {
    if (locale === "en") {
      setTranslatedBlog(blogRef.current);
      return;
    }

    if (!blogRef.current) {
      setTranslatedBlog(undefined);
      return;
    }

    if (contentKey && contentKey === prevKeyRef.current) return;

    let cancelled = false;

    const run = async () => {
      const cur = blogRef.current!;

      // ── Collect all items to translate ──────────────────────────────────
      // Items that are plain text
      const textItems: { path: string; text: string }[] = [];
      // Items that are HTML (paragraph block.text) - preserve tags
      const htmlItems: { path: string; text: string }[] = [];

      // Title
      if (cur.title) textItems.push({ path: "title", text: cur.title });

      // Content blocks
      cur.content?.forEach((block, bi) => {
        switch (block.type) {
          case "paragraph":
            if (block.text)
              htmlItems.push({ path: `content.${bi}.text`, text: block.text });
            break;
          case "heading":
            if (block.text)
              textItems.push({ path: `content.${bi}.text`, text: block.text });
            break;
          case "image":
            if (block.caption)
              textItems.push({
                path: `content.${bi}.caption`,
                text: block.caption,
              });
            break;
          case "quote":
            if (block.text)
              textItems.push({ path: `content.${bi}.text`, text: block.text });
            if (block.citation)
              textItems.push({
                path: `content.${bi}.citation`,
                text: block.citation,
              });
            break;
          case "list":
            block.items?.forEach((item, ii) => {
              if (item)
                textItems.push({
                  path: `content.${bi}.items.${ii}`,
                  text: item,
                });
            });
            break;
          case "table":
            block.headers?.forEach((h, hi) => {
              if (h)
                textItems.push({
                  path: `content.${bi}.headers.${hi}`,
                  text: h,
                });
            });
            block.rows?.forEach((row, ri) => {
              row?.forEach((cell, ci) => {
                if (cell)
                  textItems.push({
                    path: `content.${bi}.rows.${ri}.${ci}`,
                    text: cell,
                  });
              });
            });
            break;
        }
      });

      // Inline FAQs (blog-level FAQs, not the /faq page)
      cur.faqs?.forEach((faq, fi) => {
        if (faq.question)
          textItems.push({ path: `faqs.${fi}.question`, text: faq.question });
        if (faq.answer)
          textItems.push({ path: `faqs.${fi}.answer`, text: faq.answer });
      });

      // Tags
      cur.tags?.forEach((tag, ti) => {
        if (tag.name)
          textItems.push({ path: `tags.${ti}.name`, text: tag.name });
      });

      // ── Translate both batches concurrently ──────────────────────────────
      const [translatedTexts, translatedHtmls] = await Promise.all([
        textItems.length > 0
          ? fetchTranslations(
              textItems.map((i) => i.text),
              locale,
              "text",
            )
          : Promise.resolve([] as string[]),
        htmlItems.length > 0
          ? fetchTranslations(
              htmlItems.map((i) => i.text),
              locale,
              "html",
            )
          : Promise.resolve([] as string[]),
      ]);

      if (cancelled) return;

      // ── Deep-clone and apply ─────────────────────────────────────────────
      const result = JSON.parse(JSON.stringify(cur)) as Record<string, unknown>;

      textItems.forEach(({ path }, idx) => {
        applyPath(result, path, translatedTexts[idx] ?? textItems[idx].text);
      });

      htmlItems.forEach(({ path }, idx) => {
        applyPath(result, path, translatedHtmls[idx] ?? htmlItems[idx].text);
      });

      // Only mark this key "done" once the translation actually lands, so a
      // cancelled run (e.g. React Strict Mode's dev-only double-invoke of
      // effects) never blocks the real run from retrying.
      prevKeyRef.current = contentKey;
      setTranslatedBlog(result as T);
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey, locale]);

  return locale === "en" ? blog : (translatedBlog ?? blog);
}
