import type { Metadata } from "next";
import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return createMetadata({
    ...seoPages.requestForTutors,
    locale: params.locale,
  });
}

export default function RequestForTutorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Find a Tutor"
        path={seoPages.requestForTutors.path}
      />
      {children}
    </>
  );
}
