import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.blogs);

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
