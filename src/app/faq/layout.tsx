import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.faq);

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
