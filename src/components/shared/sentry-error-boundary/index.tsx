"use client";

import * as Sentry from "@sentry/nextjs";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const SentryErrorBoundary: FC<Props> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-lightwhite px-6 text-center text-base font-medium text-black">
          Something went wrong. Please refresh the page or try again later.
        </div>
      }
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};
