import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.gradesAndSubjects);

export default function GradesAndSubjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
