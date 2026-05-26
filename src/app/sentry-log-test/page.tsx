import { env } from "@/configs/env";
import { isSentryEnabled } from "@/lib/sentry";
import { notFound } from "next/navigation";
import { SentryLogTestClient } from "./SentryLogTestClient";

export default function SentryLogTestPage() {
  if (!env.app.enableSentryTestLogger || !isSentryEnabled) {
    notFound();
  }

  return <SentryLogTestClient />;
}
