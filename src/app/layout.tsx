import NavBar from "@/components/shared/navbar";
import Script from "next/script";
import Footer from "@/components/shared/footer";
import BackToTop from "@/components/shared/back-to-top";
import RouteScrollManager from "@/components/shared/route-scroll-manager";
import "./globals.css";
import { WithProviders } from "@/hocs/with-providers";

export const metadata = {
  title: "Tuition Lanka",
  description: "Change how you learn with a tutor",
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
          <RouteScrollManager />
          <main className="site-shell bg-lightwhite flex flex-col">
            <NavBar />
            <div className="flex-1">{children}</div>
            <Footer />
          </main>
        </WithProviders>
        <BackToTop />
      </body>
    </html>
  );
}
