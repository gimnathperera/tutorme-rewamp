"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-lightwhite px-6 text-center text-base font-medium text-black">
          Something went wrong. Please refresh the page or try again later.
        </div>
      </body>
    </html>
  );
}
