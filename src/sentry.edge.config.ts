import * as Sentry from "@sentry/nextjs";
import { isSentryEnabled, sentryBaseConfig } from "@/lib/sentry";

if (isSentryEnabled) {
  Sentry.init(sentryBaseConfig);
}
