import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.testPapers);

export default function TestPapersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Past Exam Papers"
        path={seoPages.testPapers.path}
      />
      {children}
    </>
  );
}
