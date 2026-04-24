import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata({
  ...seoPages.requestForTutors,
  title: "Request a Home Tutor | Tuition Lanka",
  description:
    "Submit your tutor request and tell Tuition Lanka what grade, subject, medium, and learning support you need.",
  path: "/request-for-tutors/create-request",
});

export default function CreateTutorRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
