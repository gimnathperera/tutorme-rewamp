import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Create TuitionLanka Blog Article Post | TuitionLanka",
  description:
    "Create a TuitionLanka blog article with study tips, exam guidance, and education insights for students, parents, and home tutors.",
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
