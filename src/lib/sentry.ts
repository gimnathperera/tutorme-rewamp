import { env } from "@/configs/env";

const SENTRY_ENABLED_ENVS = ["production", "staging"];

export const sentryDsn = env.app.sentryDsn;

export const appEnvironment = env.app.appEnv;

export const isSentryEnabled =
  Boolean(sentryDsn) && SENTRY_ENABLED_ENVS.includes(appEnvironment);

export const sentryBaseConfig = {
  dsn: sentryDsn,
  environment: appEnvironment,
  enabled: isSentryEnabled,
  tracesSampleRate: appEnvironment === "production" ? 0.1 : 1.0,
};

export const shouldShowSentryTestTrigger = appEnvironment !== "production";
