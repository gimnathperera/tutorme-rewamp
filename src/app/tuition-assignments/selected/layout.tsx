import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Selected Tuition Assignments | Tuition Lanka",
  description:
    "Review selected tuition assignments before continuing with Tuition Lanka.",
  path: "/tuition-assignments/selected",
  noIndex: true,
});

export default function SelectedAssignmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
