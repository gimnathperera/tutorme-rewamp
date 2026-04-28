import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.levelAndExams);

export default function LevelAndExamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Level and Exams"
        path={seoPages.levelAndExams.path}
      />
      {children}
    </>
  );
}
