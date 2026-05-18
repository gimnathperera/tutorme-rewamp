const path = require("path");
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

module.exports = withNextIntl({
  webpack: (config) => {
    // Resolve "/images/..." imports to the public/images directory.
    // This lets you write: import X from "/images/foo.png"
    // instead of fragile relative paths like "../../../public/images/foo.png"
    config.resolve.alias["/images"] = path.join(__dirname, "public", "images");
    return config;
  },
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
});
