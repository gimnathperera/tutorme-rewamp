import { createMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { id: string } }) {
  return createMetadata({
    title: "Edit TuitionLanka Blog Article Post | TuitionLanka",
    description:
      "Edit a TuitionLanka blog article with study tips, exam guidance, and education insights for students, parents, and home tutors.",
    path: `/blogs/components/edit-blog/${params.id}`,
    noIndex: true,
  });
}

export default function EditBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
