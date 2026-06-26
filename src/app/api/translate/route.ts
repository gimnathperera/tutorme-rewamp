import { NextRequest, NextResponse } from "next/server";
import { translate, translateMany } from "@/lib/translate";

/**
 * POST /api/translate
 *
 * Body (single):  { text: string,   locale: string, format?: "text"|"html" }
 * Body (batch):   { texts: string[], locale: string, format?: "text"|"html" }
 *
 * Response (single): { translated: string }
 * Response (batch):  { translated: string[] }
 *
 * `format` defaults to "text". Pass "html" for paragraph blocks so that
 * Google Translate preserves HTML tags and only translates text nodes.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { locale, format = "text" } = body;

  if (!locale) {
    return NextResponse.json({ error: "locale is required" }, { status: 400 });
  }

  const translationEnabled = Boolean(process.env.GOOGLE_TRANSLATE_API_KEY);

  if (Array.isArray(body.texts)) {
    const translated = await translateMany(body.texts, locale, format);
    return NextResponse.json({ translated, translationEnabled });
  }

  if (typeof body.text === "string") {
    const translated = await translate(body.text, locale, format);
    return NextResponse.json({ translated, translationEnabled });
  }

  return NextResponse.json(
    { error: "text or texts is required" },
    { status: 400 },
  );
}
