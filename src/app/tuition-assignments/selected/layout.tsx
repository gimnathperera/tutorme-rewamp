import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Selected Tuition Assignments for Tutors | Tuition Lanka",
  description:
    "Review selected tuition assignments in Sri Lanka before continuing with Tuition Lanka tutor matching, parent contact, and assignment management.",
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
