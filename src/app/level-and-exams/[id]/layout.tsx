import { createMetadata, seoPages } from "@/lib/seo";

export function generateMetadata({ params }: { params: { id: string } }) {
  return createMetadata({
    ...seoPages.levelAndExams,
    title: "Exam Level and Subject Tuition Details | Tuition Lanka",
    description:
      "Find level-specific tuition support, subject coverage, tutor expectations, and home tuition rates for students and parents in Sri Lanka.",
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
