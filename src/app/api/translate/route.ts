import { NextRequest, NextResponse } from "next/server";
import { translate, translateMany } from "@/lib/translate";

/**
 * POST /api/translate
 * Body: { text: string, locale: string }          → { translated: string }
 *    or { texts: string[], locale: string }        → { translated: string[] }
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { locale } = body;

  if (!locale) {
    return NextResponse.json({ error: "locale is required" }, { status: 400 });
  }

  if (Array.isArray(body.texts)) {
    const translated = await translateMany(body.texts, locale);
    return NextResponse.json({ translated });
  }

  if (typeof body.text === "string") {
    const translated = await translate(body.text, locale);
    return NextResponse.json({ translated });
  }

  return NextResponse.json({ error: "text or texts is required" }, { status: 400 });
}
