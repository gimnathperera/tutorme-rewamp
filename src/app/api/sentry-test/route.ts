import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import {
  appEnvironment,
  isSentryEnabled,
  shouldShowSentryTestTrigger,
} from "@/lib/sentry";

export async function POST() {
  if (!shouldShowSentryTestTrigger) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (!isSentryEnabled) {
    return NextResponse.json(
      {
        message:
          "Sentry is disabled. Set NEXT_PUBLIC_SENTRY_DSN and NEXT_PUBLIC_APP_ENV=staging to test locally.",
        environment: appEnvironment,
      },
      { status: 400 },
    );
  }

  const eventId = Sentry.captureException(
    new Error("Sentry Example Page Error"),
  );
  const flushed = await Sentry.flush(5000);

  return NextResponse.json({
    eventId,
    flushed,
    environment: appEnvironment,
  });
}
