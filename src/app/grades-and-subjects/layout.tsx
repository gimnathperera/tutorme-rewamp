import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.gradesAndSubjects);

export default function GradesAndSubjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Grades and Subjects"
        path={seoPages.gradesAndSubjects.path}
      />
      {children}
    </>
  );
}
