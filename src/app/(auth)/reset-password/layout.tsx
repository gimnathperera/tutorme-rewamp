import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata(seoPages.resetPassword);

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
