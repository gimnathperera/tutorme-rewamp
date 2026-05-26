"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export function SentryLogTestClient() {
  const [lastSentAt, setLastSentAt] = useState<string | null>(null);

  const sendTestLog = () => {
    const sentAt = new Date().toISOString();

    Sentry.logger.info("User triggered test log", {
      log_source: "sentry_test",
      sent_at: sentAt,
    });

    console.log("Sentry console log test", { log_source: "sentry_test" });
    console.warn("Sentry console warn test", { log_source: "sentry_test" });
    console.error("Sentry console error test", { log_source: "sentry_test" });

    setLastSentAt(sentAt);
  };

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold text-gray-950">
        Sentry Log Test
      </h1>
      <p className="mt-4 text-base leading-7 text-gray-600">
        Click the button once, then check Sentry Logs for
        <span className="font-medium text-gray-950">
          {" "}
          User triggered test log
        </span>
        .
      </p>
      <button
        type="button"
        onClick={sendTestLog}
        className="mt-8 rounded-md bg-primary-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
      >
        Send test log
      </button>
      {lastSentAt ? (
        <p className="mt-4 text-sm text-gray-500">Sent at {lastSentAt}</p>
      ) : null}
    </div>
  );
}
