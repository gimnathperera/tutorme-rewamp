import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.tuitionAssignments);

export default function TuitionAssignmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Tuition Assignments"
        path={seoPages.tuitionAssignments.path}
      />
      {children}
    </>
  );
}
