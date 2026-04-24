import NavBar from "@/components/shared/navbar";
import Script from "next/script";
import { Suspense } from "react";
import Footer from "@/components/shared/footer";
import BackToTop from "@/components/shared/back-to-top";
import RouteScrollManager from "@/components/shared/route-scroll-manager";
import "./globals.css";
import { WithProviders } from "@/hocs/with-providers";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = {
  ...createMetadata(seoPages.home),
  verification: {
    google: "euNzGr2NazmC3paB9xamB2El7bk8uGq0wYv_l90lj7Q",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script src="/env-config.js" strategy="afterInteractive" />
        <WithProviders>
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
        <BackToTop />
      </body>
    </html>
  );
}
