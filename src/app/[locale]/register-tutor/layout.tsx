import type { Metadata } from "next";
import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return createMetadata({ ...seoPages.registerTutor, locale: params.locale });
}

export default function RegisterTutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Register Tutor"
        path={seoPages.registerTutor.path}
      />
      {children}
    </>
  );
}
