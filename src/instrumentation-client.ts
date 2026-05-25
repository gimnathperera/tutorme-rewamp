import * as Sentry from "@sentry/nextjs";
import { isSentryEnabled, sentryBaseConfig } from "@/lib/sentry";

if (isSentryEnabled) {
  Sentry.init({
    ...sentryBaseConfig,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        maskAllInputs: true,
        blockAllMedia: true,
      }),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
