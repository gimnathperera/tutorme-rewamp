import { PageBreadcrumbJsonLd } from "@/components/seo/json-ld";
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
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <>
      <PageBreadcrumbJsonLd
        name="Exam Level Details"
        path={`/level-and-exams/${params.id}`}
        parents={[
          {
            name: "Level and Exams",
            path: seoPages.levelAndExams.path,
          },
        ]}
      />
      {children}
    </>
  );
}
