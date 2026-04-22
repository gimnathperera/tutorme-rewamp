import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.contactUs);

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
