import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata({
  ...seoPages.requestForTutors,
  title: "Submit a Home Tutor Request in Sri Lanka | Tuition Lanka",
  description:
    "Complete your tutor request with grade, subject, medium, location, and learning needs so Tuition Lanka can match the right home tutor.",
  path: "/request-for-tutors/create-request",
});

export default function CreateTutorRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Create Tutor Request"
        path="/request-for-tutors/create-request"
        parents={[
          {
            name: "Request for Tutors",
            path: seoPages.requestForTutors.path,
          },
        ]}
      />
      {children}
    </>
  );
}
