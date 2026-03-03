import NavBar from "@/components/shared/navbar";
import Script from "next/script";
import Footer from "@/components/shared/footer";
import BackToTop from "@/components/shared/back-to-top";
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
          <main className="bg-lightwhite pt-12 sm:pt-20">
            <NavBar />
            {children}
            <Footer />
          </main>
        </WithProviders>
        <BackToTop />
      </body>
    </html>
  );
}
