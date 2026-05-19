"use client";

import { shouldShowSentryTestTrigger } from "@/lib/sentry";

export const SentryTestErrorButton = () => {
  if (!shouldShowSentryTestTrigger) {
    return null;
  }

  return (
    <button
      type="button"
      className="fixed bottom-5 left-5 z-50 rounded bg-red-700 px-3 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-red-800"
      onClick={() => {
        throw new Error("Sentry Test Error");
      }}
    >
      Trigger Sentry Error
    </button>
  );
};
