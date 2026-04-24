import { createMetadata, seoPages } from "@/lib/seo";

export function generateMetadata({ params }: { params: { slug: string } }) {
  return createMetadata({
    ...seoPages.blogs,
    title: "Study Tips and Exam Preparation Article | Tuition Lanka",
    description:
      "Read Tuition Lanka education articles with practical study tips, exam guides, and tutor advice for students, parents, and home tutors in Sri Lanka.",
    path: `/blogs/${params.slug}`,
  });
}

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
