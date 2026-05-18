import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Create Tuition Lanka Blog Article Post | Tuition Lanka",
  description:
    "Create a Tuition Lanka blog article with study tips, exam guidance, and education insights for students, parents, and home tutors.",
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
