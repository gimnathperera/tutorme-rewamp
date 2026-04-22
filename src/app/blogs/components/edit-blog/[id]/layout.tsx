import { createMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { id: string } }) {
  return createMetadata({
    title: "Edit Blog | Tuition Lanka",
    description: "Edit a Tuition Lanka blog article.",
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
