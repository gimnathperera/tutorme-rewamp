import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.tuitionAssignments);

export default function TuitionAssignmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
