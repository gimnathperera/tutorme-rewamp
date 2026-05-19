const { withSentryConfig } = require("@sentry/nextjs");

const sentryOrg = process.env.SENTRY_ORG || "tuitionlanka";
const sentryProject = process.env.SENTRY_PROJECT || "tutorme-rewamp";
const canUploadSentrySourcemaps = Boolean(
  process.env.SENTRY_AUTH_TOKEN && sentryOrg && sentryProject,
);

const nextConfig = {
  // standalone output requires symlink support (Linux/Docker only).
  // On Windows, set BUILD_STANDALONE=true only when building for Docker.
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  env: {
    VITE_SENTRY_DSN: process.env.VITE_SENTRY_DSN || "",
    VITE_APP_ENV: process.env.VITE_APP_ENV || "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "placeimg.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.core.windows.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "tuitionlanka.com",
          },
        ],
        destination: "https://www.tuitionlanka.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: sentryOrg,
  project: sentryProject,
  silent: !process.env.CI,
  sourcemaps: {
    disable: !canUploadSentrySourcemaps,
  },
  release: {
    create: canUploadSentrySourcemaps,
  },
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
