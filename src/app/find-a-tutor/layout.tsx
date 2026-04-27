import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.findTutor);

export default function FindATutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd name="Find a Tutor" path={seoPages.findTutor.path} />
      {children}
    </>
  );
}
