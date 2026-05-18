import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "si", "ta"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
