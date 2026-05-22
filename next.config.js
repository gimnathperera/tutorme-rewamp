const { withSentryConfig } = require("@sentry/nextjs");

const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;
const canUploadSentrySourcemaps = Boolean(
  process.env.SENTRY_AUTH_TOKEN && sentryOrg && sentryProject,
);

const nextConfig = {
  // standalone output requires symlink support (Linux/Docker only).
  // On Windows, set BUILD_STANDALONE=true only when building for Docker.
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
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
    deleteSourcemapsAfterUpload: true,
  },
  release: {
    name: process.env.SENTRY_RELEASE,
    create: canUploadSentrySourcemaps,
  },
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
