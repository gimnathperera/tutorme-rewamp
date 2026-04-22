import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.requestForTutors);

export default function RequestForTutorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
