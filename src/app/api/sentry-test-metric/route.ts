import * as Sentry from "@sentry/nextjs";
import { env } from "@/configs/env";
import { isSentryEnabled } from "@/lib/sentry";
import { NextResponse } from "next/server";

export async function POST() {
  if (!env.app.enableSentryTestLogger || !isSentryEnabled) {
    return NextResponse.json(
      { error: "Sentry test logger is disabled" },
      { status: 404 },
    );
  }

  const sentAt = new Date().toISOString();

  Sentry.logger.info("Server triggered test log", {
    log_source: "sentry_test",
    sent_at: sentAt,
  });
  Sentry.metrics.count("test_metric", 1);
  Sentry.metrics.distribution("sentry_test_metric_value", 150);

  await Sentry.flush(2000);

  return NextResponse.json({ ok: true, sentAt });
}
