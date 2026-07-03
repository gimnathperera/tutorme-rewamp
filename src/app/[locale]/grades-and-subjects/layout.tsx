import type { Metadata } from "next";
import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return createMetadata({
    ...seoPages.gradesAndSubjects,
    locale: params.locale,
  });
}

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
