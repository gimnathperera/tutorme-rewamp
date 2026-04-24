import { createMetadata, seoPages } from "@/lib/seo";

export function generateMetadata({ params }: { params: { id: string } }) {
  return createMetadata({
    ...seoPages.tuitionRates,
    title: "Home Tuition Rate Details in Sri Lanka | Tuition Lanka",
    description:
      "View detailed tuition rate information by grade, subject, tutor experience, and class type for home and online tuition across Sri Lanka.",
    path: `/tuition-rates/${params.id}/rate`,
  });
}

export default function TuitionRateDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
