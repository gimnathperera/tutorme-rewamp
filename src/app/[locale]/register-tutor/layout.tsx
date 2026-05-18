import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.registerTutor);

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
