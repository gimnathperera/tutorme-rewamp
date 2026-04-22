import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.testPapers);

export default function TestPapersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
