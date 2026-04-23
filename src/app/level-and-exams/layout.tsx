import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.levelAndExams);

export default function LevelAndExamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
