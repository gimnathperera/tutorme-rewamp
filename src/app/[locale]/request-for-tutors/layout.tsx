import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.requestForTutors);

export default function RequestForTutorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Request for Tutors"
        path={seoPages.requestForTutors.path}
      />
      {children}
    </>
  );
}
