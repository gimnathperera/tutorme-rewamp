/**
 * Lightweight translation cache + helper.
 *
 * Uses Google Cloud Translation (free tier: 500k chars/month).
 * Set GOOGLE_TRANSLATE_API_KEY in your .env to enable.
 * Falls back to the original text when the key is missing or the locale is "en".
 */

const SUPPORTED_LOCALES = ["si", "ta"] as const;
type TranslatableLocale = (typeof SUPPORTED_LOCALES)[number];

// ISO 639-1 codes expected by Google Translate
const LOCALE_TO_LANG: Record<TranslatableLocale, string> = {
  si: "si",
  ta: "ta",
};

// Module-level in-memory cache (survives across requests in the same server process)
const translationCache = new Map<string, string>();

function cacheKey(text: string, locale: string) {
  return `${locale}::${text}`;
}

async function callGoogleTranslate(
  text: string,
  targetLang: string,
): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) return text;

  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: "en", target: targetLang, format: "text" }),
      next: { revalidate: 86400 }, // cache the fetch response for 24 h (Next.js)
    },
  );

  if (!res.ok) return text;

  const json = await res.json();
  return json?.data?.translations?.[0]?.translatedText ?? text;
}

/**
 * Translate a single string to the given locale.
 * Returns the original text for "en" or when the API is not configured.
 */
export async function translate(text: string, locale: string): Promise<string> {
  if (!text || locale === "en" || !SUPPORTED_LOCALES.includes(locale as TranslatableLocale)) {
    return text;
  }

  const key = cacheKey(text, locale);
  if (translationCache.has(key)) return translationCache.get(key)!;

  const targetLang = LOCALE_TO_LANG[locale as TranslatableLocale];
  const translated = await callGoogleTranslate(text, targetLang);
  translationCache.set(key, translated);
  return translated;
}

/**
 * Translate multiple strings at once (batches a single API call).
 * Returns an array in the same order as the input.
 */
export async function translateMany(
  texts: string[],
  locale: string,
): Promise<string[]> {
  if (!texts.length || locale === "en") return texts;

  return Promise.all(texts.map((t) => translate(t, locale)));
}

/**
 * Translate specific keys of a plain object.
 *
 * @example
 * const translated = await translateObject(blogPost, ["title", "excerpt"], locale);
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
