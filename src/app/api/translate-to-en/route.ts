import { NextRequest, NextResponse } from "next/server";

const cache = new Map<string, string>();

async function toEnglish(texts: string[]): Promise<string[]> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) return texts;

  const results = [...texts];
  const toFetch: { idx: number; text: string }[] = [];

  texts.forEach((text, idx) => {
    if (!text?.trim()) return;
    if (cache.has(text)) {
      results[idx] = cache.get(text)!;
    } else {
      toFetch.push({ idx, text });
    }
  });

  if (toFetch.length === 0) return results;

  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: toFetch.map((x) => x.text),
        target: "en",
        format: "text",
      }),
    },
  );

  if (!res.ok) return results;

  const json = await res.json();
  const translated: string[] =
    json?.data?.translations?.map(
      (t: { translatedText: string }) => t.translatedText,
    ) ?? toFetch.map((x) => x.text);

  toFetch.forEach(({ idx, text }, i) => {
    const result = translated[i] ?? text;
    results[idx] = result;
    cache.set(text, result);
  });

  return results;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!Array.isArray(body.texts)) {
    return NextResponse.json({ error: "texts array is required" }, { status: 400 });
  }
  const translated = await toEnglish(body.texts);
  return NextResponse.json({ translated });
}
