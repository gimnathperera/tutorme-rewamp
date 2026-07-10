import type { Metadata } from "next";
import NavBar from "@/components/shared/navbar";
import Script from "next/script";
import { Suspense } from "react";
import Footer from "@/components/shared/footer";
import BackToTop from "@/components/shared/back-to-top";
import RouteScrollManager from "@/components/shared/route-scroll-manager";
import { WithProviders } from "@/hocs/with-providers";
import { createMetadata, seoPages } from "@/lib/seo";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    ...createMetadata({ ...seoPages.home, locale: params.locale }),
    verification: {
      google: "euNzGr2NazmC3paB9xamB2El7bk8uGq0wYv_l90lj7Q",
    },
    icons: {
      icon: "/images/logo/LightThemeLogoIcon.svg",
      shortcut: "/images/logo/LightThemeLogoIcon.svg",
      apple: "/images/logo/LightThemeLogoIcon.svg",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={params.locale}>
      <body>
        <Script src="/env-config.js" strategy="afterInteractive" />
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <WithProviders locale={params.locale}>
            <>
              <RouteScrollManager />
              <main className="site-shell bg-lightwhite flex flex-col">
                <Suspense fallback={null}>
                  <NavBar />
                </Suspense>
                <div className="flex-1">{children}</div>
                <Footer />
              </main>
            </>
          </WithProviders>
        </NextIntlClientProvider>
        <BackToTop />
      </body>
    </html>
  );
}
