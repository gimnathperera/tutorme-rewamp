import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.findTutor);

export default function FindATutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
