/**
 * Lightweight translation helper (server-side only).
 *
 * Uses Google Cloud Translation v2 (Basic) – free tier: 500 k chars / month.
 * Set GOOGLE_TRANSLATE_API_KEY in your .env to enable.
 * Falls back to the original text silently when the key is missing or the
 * locale is "en".
 */

const SUPPORTED_LOCALES = ["si", "ta"] as const;
type TranslatableLocale = (typeof SUPPORTED_LOCALES)[number];

const LOCALE_TO_LANG: Record<TranslatableLocale, string> = {
  si: "si",
  ta: "ta",
};

// Module-level in-memory cache (survives across requests in the same process)
const translationCache = new Map<string, string>();

/** Cache key includes format so html and text translations are stored separately. */
function cacheKey(
  text: string,
  locale: string,
  format: "text" | "html" = "text",
) {
  return `${locale}:${format}:${text}`;
}

/** Single Google Translate API call for one or many strings. */
async function callGoogleTranslate(
  texts: string[],
  targetLang: string,
  format: "text" | "html" = "text",
): Promise<string[]> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) return texts;

  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: texts,
        source: "en",
        target: targetLang,
        format,
      }),
      next: { revalidate: 86400 },
    },
  );

  if (!res.ok) return texts;

  const json = await res.json();
  return (
    json?.data?.translations?.map(
      (t: { translatedText: string }) => t.translatedText,
    ) ?? texts
  );
}

/**
 * Translate a single string to the given locale.
 * Returns the original text for "en" or when the API is not configured.
 */
export async function translate(
  text: string,
  locale: string,
  format: "text" | "html" = "text",
): Promise<string> {
  if (
    !text?.trim() ||
    locale === "en" ||
    !SUPPORTED_LOCALES.includes(locale as TranslatableLocale)
  ) {
    return text;
  }

  const key = cacheKey(text, locale, format);
  if (translationCache.has(key)) return translationCache.get(key)!;

  const targetLang = LOCALE_TO_LANG[locale as TranslatableLocale];
  const [translated] = await callGoogleTranslate([text], targetLang, format);
  translationCache.set(key, translated);
  return translated;
}

/**
 * Translate multiple strings using a SINGLE batched API call.
 * Cached entries are served from memory; only uncached ones hit the API.
 * Returns an array in the same order as the input.
 *
 * @param format  "text" (default) for plain strings; "html" to preserve HTML tags.
 */
export async function translateMany(
  texts: string[],
  locale: string,
  format: "text" | "html" = "text",
): Promise<string[]> {
  if (
    !texts.length ||
    locale === "en" ||
    !SUPPORTED_LOCALES.includes(locale as TranslatableLocale)
  ) {
    return texts;
  }

  const results = [...texts];
  const toFetch: { idx: number; text: string }[] = [];

  texts.forEach((text, idx) => {
    if (!text?.trim()) return;
    const key = cacheKey(text, locale, format);
    if (translationCache.has(key)) {
      results[idx] = translationCache.get(key)!;
    } else {
      toFetch.push({ idx, text });
    }
  });

  if (toFetch.length === 0) return results;

  const targetLang = LOCALE_TO_LANG[locale as TranslatableLocale];

  try {
    const translated = await callGoogleTranslate(
      toFetch.map((x) => x.text),
      targetLang,
      format,
    );

    toFetch.forEach(({ idx, text }, i) => {
      const result = translated[i] ?? text;
      results[idx] = result;
      translationCache.set(cacheKey(text, locale, format), result);
    });
  } catch {
    // Fall back to originals for uncached items
  }

  return results;
}

/**
 * Translate specific keys of a plain object (unchanged API, kept for compat).
 */
export async function translateObject<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
  locale: string,
): Promise<T> {
  if (locale === "en") return obj;

  const result = { ...obj };
  await Promise.all(
    keys.map(async (key) => {
      const val = obj[key];
      if (typeof val === "string") {
        (result as Record<string, unknown>)[key as string] = await translate(
          val,
          locale,
        );
      }
    }),
  );
  return result;
}
