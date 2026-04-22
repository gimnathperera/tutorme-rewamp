import { createMetadata, seoPages } from "@/lib/seo";

export function generateMetadata({ params }: { params: { id: string } }) {
  return createMetadata({
    ...seoPages.tuitionRates,
    title: "Tuition Rate Details | Tuition Lanka",
    description:
      "View detailed tuition rate information by grade, subject, and class type for home and online tuition in Sri Lanka.",
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
