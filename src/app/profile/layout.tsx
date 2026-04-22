import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.profile);

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
