module.exports = {
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
