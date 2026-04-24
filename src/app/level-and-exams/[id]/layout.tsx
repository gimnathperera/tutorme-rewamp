import { createMetadata, seoPages } from "@/lib/seo";

export function generateMetadata({ params }: { params: { id: string } }) {
  return createMetadata({
    ...seoPages.levelAndExams,
    title: "Exam and Level Tuition Details | Tuition Lanka",
    description:
      "Find level-specific tuition support, subject coverage, tutor expectations, and tuition rates for students in Sri Lanka.",
    path: `/level-and-exams/${params.id}`,
  });
}

export default function LevelAndExamDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
