import * as Sentry from "@sentry/nextjs";
import { env } from "@/configs/env";

const SENTRY_ENABLED_ENVS = ["production", "staging"];

export const sentryDsn = env.app.sentryDsn;

export const appEnvironment = env.app.appEnv;

export const sentryRelease = env.app.sentryRelease || undefined;

export const sentryReplaySessionSampleRate =
  appEnvironment === "production" ? 0.1 : 1.0;

export const isSentryEnabled =
  Boolean(sentryDsn) && SENTRY_ENABLED_ENVS.includes(appEnvironment);

export const sentryBaseConfig = {
  dsn: sentryDsn,
  environment: appEnvironment,
  enabled: isSentryEnabled,
  release: sentryRelease,
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  enableLogs: true,
  autoSessionTracking: true,
  tracesSampleRate: appEnvironment === "production" ? 0.1 : 1.0,
};
