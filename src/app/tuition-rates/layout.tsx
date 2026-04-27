import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.tuitionRates);

export default function TuitionRatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Tuition Rates"
        path={seoPages.tuitionRates.path}
      />
      {children}
    </>
  );
}
