import type { Metadata } from "next";
import JsonLd, { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createFaqJsonLd, createMetadata, seoPages } from "@/lib/seo";
import { fetchSeoFaqs } from "@/lib/seo-data";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return createMetadata({ ...seoPages.faq, locale: params.locale });
}

export default async function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqs = await fetchSeoFaqs();

  return (
    <>
      <PageBreadcrumbJsonLd name="FAQ" path={seoPages.faq.path} />
      {faqs.length > 0 && <JsonLd data={createFaqJsonLd(faqs)} />}
      {children}
    </>
  );
}
