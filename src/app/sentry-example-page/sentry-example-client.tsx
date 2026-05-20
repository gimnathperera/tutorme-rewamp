"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export const SentryExampleClient = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const triggerTestError = async () => {
    setIsSending(true);
    setStatus("Sending test error to Sentry...");

    try {
      const response = await fetch("/api/sentry-test", { method: "POST" });
      const result = (await response.json()) as {
        eventId?: string;
        flushed?: boolean;
        message?: string;
      };

      if (!response.ok) {
        setStatus(result.message || "Sentry test failed.");
        return;
      }

      const clientEventId = Sentry.captureException(
        new Error("Sentry Example Page Browser Error"),
      );
      const clientFlushed = await Sentry.flush(5000);

      setStatus(
        result.flushed && clientFlushed
          ? `Sent test errors to Sentry. Server event: ${result.eventId}. Browser event: ${clientEventId}.`
          : `Created Sentry events. Server event: ${result.eventId}. Browser event: ${clientEventId}. Delivery was not fully confirmed before the timeout.`,
      );
    } catch {
      setStatus("Could not call the Sentry test endpoint.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-lightwhite px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold text-black">
          Sentry Example Page
        </h1>
        <p className="mt-3 text-sm text-slate-700">
          Use this page in staging or development to verify Sentry error
          reporting.
        </p>
        <button
          type="button"
          disabled={isSending}
          className="mt-6 rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-800"
          onClick={triggerTestError}
        >
          {isSending ? "Sending..." : "Trigger Test Error"}
        </button>
        {status && <p className="mt-4 text-sm text-slate-700">{status}</p>}
      </div>
    </main>
  );
};
