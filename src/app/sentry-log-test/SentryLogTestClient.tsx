"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export function SentryLogTestClient() {
  const [lastSentAt, setLastSentAt] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const sendSentryTestSignals = async () => {
    const sentAt = new Date().toISOString();

    setIsSending(true);

    Sentry.logger.info("User triggered test log", {
      log_source: "sentry_test",
      sent_at: sentAt,
    });

    Sentry.metrics.count("test_metric", 1);
    Sentry.metrics.distribution("sentry_test_metric_value", 150);

    console.log("Sentry console log test", { log_source: "sentry_test" });
    console.warn("Sentry console warn test", { log_source: "sentry_test" });
    console.error("Sentry console error test", { log_source: "sentry_test" });

    try {
      await fetch("/api/sentry-test-metric", {
        method: "POST",
      });
      await Sentry.flush(2000);
      setLastSentAt(new Date().toISOString());
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold text-gray-950">
        Sentry Test
      </h1>
      <p className="mt-4 text-base leading-7 text-gray-600">
        Click the button once, then check Sentry Logs for
        <span className="font-medium text-gray-950">
          {" "}
          User triggered test log
        </span>
        {" "}and Sentry Metrics for
        <span className="font-medium text-gray-950"> test_metric</span>.
      </p>
      <button
        type="button"
        onClick={sendSentryTestSignals}
        disabled={isSending}
        className="mt-8 rounded-md bg-primary-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
      >
        {isSending ? "Sending..." : "Send test log and metric"}
      </button>
      {lastSentAt ? (
        <p className="mt-4 text-sm text-gray-500">Sent at {lastSentAt}</p>
      ) : null}
    </div>
  );
}
