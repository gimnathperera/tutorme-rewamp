import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.contactUs);

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd name="Contact Us" path={seoPages.contactUs.path} />
      {children}
    </>
  );
}
