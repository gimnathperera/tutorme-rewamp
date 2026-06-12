"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

// ── Client-side in-memory cache (shared across all hook instances) ───────────
const clientCache = new Map<string, string>();

export async function translateBatch(
  texts: string[],
  locale: string,
): Promise<string[]> {
  if (!texts.length || locale === "en") return texts;

  const results = new Array<string>(texts.length);
  const toFetch: { idx: number; text: string }[] = [];

  texts.forEach((text, idx) => {
    if (!text?.trim()) {
      results[idx] = text ?? "";
      return;
    }
    const key = `${locale}::${text}`;
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
      body: JSON.stringify({ texts: toFetch.map((x) => x.text), locale }),
    });

    if (!response.ok) throw new Error("Translation request failed");

    const { translated } = (await response.json()) as {
      translated: string[];
    };

    toFetch.forEach(({ idx, text }, i) => {
      const result = translated?.[i] ?? text;
      results[idx] = result;
      clientCache.set(`${locale}::${text}`, result);
    });
  } catch {
    // Fallback: keep originals for any un-fetched slots
    toFetch.forEach(({ idx, text }) => {
      results[idx] = text;
    });
  }

  return results;
}

/**
 * Translate an array of data items coming from the back-end.
 *
 * @param items    Source array (any type T).
 * @param getTexts Extract the translatable strings from one item.
 *                 Return `undefined` / `""` for fields you want to skip.
 * @param applyTexts Apply the translated strings back to the item.
 *                   The `texts` array has the same length and order as
 *                   the return value of `getTexts`.
 *
 * Behaviour:
 * - Returns `items` unchanged (no re-render) when locale is `"en"`.
 * - Returns `items` (originals) synchronously on the first render so
 *   there is never a blank flash; switches to translated once the API
 *   responds.
 * - Caches every translation client-side to avoid redundant network calls.
 * - Batches ALL fields from ALL items into a single POST /api/translate.
 * - Correctly handles arrays that grow over time (pagination / infinite
 *   scroll): only newly-arrived texts that are not yet cached hit the API.
 */
export function useTranslateItems<T>(
  items: T[],
  getTexts: (_: T) => (string | undefined)[],
  applyTexts: (_: T, __: string[]) => T,
): T[] {
  const locale = useLocale();

  // Mutable refs so effect closures always see the latest values without
  // those values being listed as dependencies (avoids infinite loops).
  const itemsRef = useRef<T[]>(items);
  const getTextsRef = useRef(getTexts);
  const applyTextsRef = useRef(applyTexts);
  itemsRef.current = items;
  getTextsRef.current = getTexts;
  applyTextsRef.current = applyTexts;

  const [translated, setTranslated] = useState<T[]>(items);

  // Build a stable key from actual TEXT CONTENT (not object identity).
  // This means RTK Query returning a new array reference for the same data
  // does NOT trigger a redundant translation round-trip.
  let contentKey = "";
  if (locale !== "en" && items.length > 0) {
    contentKey =
      locale +
      ":" +
      items
        .map((item) => {
          try {
            return getTexts(item).join("\0");
          } catch {
            return "";
          }
        })
        .join("\n");
  }

  const prevKeyRef = useRef("");

  useEffect(() => {
    if (locale === "en") {
      setTranslated(itemsRef.current);
      return;
    }

    if (itemsRef.current.length === 0) {
      setTranslated([]);
      return;
    }

    // Bail out if the displayed text hasn't changed
    if (contentKey && contentKey === prevKeyRef.current) return;
    prevKeyRef.current = contentKey;

    let cancelled = false;

    const run = async () => {
      const currentItems = itemsRef.current;
      const perItemTexts = currentItems.map((item) =>
        getTextsRef.current(item),
      );
      const flatTexts = perItemTexts.flat().map((t) => t ?? "");
      const flatTranslated = await translateBatch(flatTexts, locale);

      if (cancelled) return;

      let offset = 0;
      const result = currentItems.map((item, i) => {
        const count = perItemTexts[i].length;
        const slice = flatTranslated.slice(offset, offset + count);
        offset += count;
        return applyTextsRef.current(item, slice);
      });

      setTranslated(result);
    };

    run();
    return () => {
      cancelled = true;
      // Reset so strict-mode remount re-attempts the API call
      prevKeyRef.current = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey, locale]);

  // For English, always return the live items (no state round-trip needed)
  return locale === "en" ? items : translated;
}
