import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Create Blog | Tuition Lanka",
  description: "Create a Tuition Lanka blog article.",
  path: "/blogs/components/create-blog",
  noIndex: true,
});

export default function CreateBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
