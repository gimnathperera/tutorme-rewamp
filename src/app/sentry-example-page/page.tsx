import { notFound } from "next/navigation";
import { SentryExampleClient } from "./sentry-example-client";
import { shouldShowSentryTestTrigger } from "@/lib/sentry";

export const metadata = {
  title: "Sentry Example Page",
};

export default function SentryExamplePage() {
  if (!shouldShowSentryTestTrigger) {
    notFound();
  }

  return <SentryExampleClient />;
}
