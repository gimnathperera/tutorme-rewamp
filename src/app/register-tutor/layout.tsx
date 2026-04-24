import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.registerTutor);

export default function RegisterTutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
