const cache = new Map<string, string>();

/**
 * Translate an array of strings to English via the /api/translate-to-en endpoint.
 * Returns originals unchanged when locale is already "en" or on any error.
 */
export async function translateTextsToEnglish(
  texts: string[],
  locale: string,
): Promise<string[]> {
  if (locale === "en" || texts.every((t) => !t?.trim())) return texts;

  const results = new Array<string>(texts.length);
  const toFetch: { idx: number; text: string }[] = [];

  texts.forEach((text, idx) => {
    if (!text?.trim()) {
      results[idx] = text ?? "";
      return;
    }
    if (cache.has(text)) {
      results[idx] = cache.get(text)!;
    } else {
      toFetch.push({ idx, text });
    }
  });

  if (toFetch.length === 0) return results;

  try {
    const response = await fetch("/api/translate-to-en", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: toFetch.map((x) => x.text) }),
    });

    if (!response.ok) throw new Error("Translation to English failed");

    const { translated } = (await response.json()) as { translated: string[] };

    toFetch.forEach(({ idx, text }, i) => {
      const result = translated[i] ?? text;
      results[idx] = result;
      cache.set(text, result);
    });
  } catch {
    toFetch.forEach(({ idx, text }) => {
      results[idx] = text;
    });
  }

  return results;
}
