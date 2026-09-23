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
    title: "Find a Home Tutor in Sri Lanka | TuitionLanka",
    description:
      "Complete your tutor request with grade, subject, medium, location, and learning needs so TuitionLanka can match the right home tutor.",
    path: "/find-a-tutor/create-request",
    locale: params.locale,
  });
}

export default function CreateTutorRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Create Tutor Request"
        path="/find-a-tutor/create-request"
        parents={[
          {
            name: "Find a Tutor",
            path: seoPages.requestForTutors.path,
          },
        ]}
      />
      {children}
    </>
  );
}
