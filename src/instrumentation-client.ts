import * as Sentry from "@sentry/nextjs";
import {
  isSentryEnabled,
  sentryBaseConfig,
  sentryReplaySessionSampleRate,
} from "@/lib/sentry";

if (isSentryEnabled) {
  Sentry.init({
    ...sentryBaseConfig,
    integrations: [
      ...sentryBaseConfig.integrations,
      Sentry.replayIntegration({
        maskAllText: true,
        maskAllInputs: true,
        blockAllMedia: true,
      }),
    ],
    replaysSessionSampleRate: sentryReplaySessionSampleRate,
    replaysOnErrorSampleRate: 1.0,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
