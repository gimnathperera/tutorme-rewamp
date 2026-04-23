import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.tuitionRates);

export default function TuitionRatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
