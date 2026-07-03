import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return createMetadata({
    title: "Create TuitionLanka Blog Article Post | TuitionLanka",
    description:
      "Create a TuitionLanka blog article with study tips, exam guidance, and education insights for students, parents, and home tutors.",
    path: "/blogs/components/create-blog",
    noIndex: true,
    locale: params.locale,
  });
}

export default function CreateBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
