import NavBar from "@/components/shared/navbar";
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
        <WithProviders>
          <main className="bg-lightwhite">
            <NavBar />
            <div className="container mx-auto">{children}</div>
            <Footer />
          </main>
        </WithProviders>
        <BackToTop />
      </body>
    </html>
  );
}
