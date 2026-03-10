"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Icon from "@/components/shared/icon";
import { useFetchGradesQuery } from "@/store/api/splits/grades/index";
import { useFetchSubjectByIdQuery } from "@/store/api/splits/subjects";
import * as Dialog from "@radix-ui/react-dialog";
import { BookOpen, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ── Subject detail popup ──────────────────────────────────────────────────────
interface SubjectDetailDialogProps {
  subjectId: string | null;
  gradeTitle: string;
  onClose: () => void;
  onStartLearning: (id: string) => void;
}

const SubjectDetailDialog: FC<SubjectDetailDialogProps> = ({
  subjectId,
  gradeTitle,
  onClose,
  onStartLearning,
}) => {
  const { data, isLoading } = useFetchSubjectByIdQuery(subjectId!, {
    skip: !subjectId,
  });

  return (
    <Dialog.Root open={!!subjectId} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel */}
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl flex flex-col max-h-[85vh] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header */}
          <div className="flex items-start gap-3 px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl shrink-0">
            <div className="bg-white/20 rounded-full p-2 shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-white font-bold text-lg leading-snug">
                {isLoading ? (
                  <Skeleton
                    width={180}
                    baseColor="#ffffff40"
                    highlightColor="#ffffff60"
                  />
                ) : (
                  data?.title ?? "Subject Details"
                )}
              </Dialog.Title>
              {gradeTitle && (
                <p className="text-white/75 text-xs mt-0.5">{gradeTitle}</p>
              )}
            </div>
            <Dialog.Close asChild>
              <button className="rounded-full p-1.5 bg-white/20 hover:bg-white/30 transition-colors text-white shrink-0">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton count={5} />
              </div>
            ) : data?.description ? (
              <p className="text-sm text-gray-600 leading-relaxed">
                {data.description}
              </p>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">
                No description available for this subject.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 shrink-0">
            <button
              className="w-full py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-teal-600 hover:to-cyan-700 transition-all shadow hover:shadow-md"
              onClick={() => {
                if (subjectId) onStartLearning(subjectId);
                onClose();
              }}
            >
              Start Learning
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// ── Per-card component ────────────────────────────────────────────────────────
interface SubjectCardProps {
  id: string;
  title: string;
  description: string;
  onStartLearning: (id: string) => void;
  onShowDetails: (id: string) => void;
}

const SubjectCard: FC<SubjectCardProps> = ({
  id,
  title,
  description,
  onStartLearning,
  onShowDetails,
}) => (
  <Card className="flex flex-col m-2 bg-white h-full">
    <CardContent className="flex-grow p-6">
      <div className="h-16 flex items-center justify-center">
        <Icon name="ScrollText" size={32} />
      </div>
      <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>
      <div className="text-center">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
          {description || `Explore lessons and resources for ${title}.`}
        </p>
        <button
          onClick={() => onShowDetails(id)}
          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
        >
          See more
        </button>
      </div>
    </CardContent>

    <CardFooter className="p-6 pt-0 mt-auto">
      <button
        className="py-3 px-5 text-sm disabled:opacity-50 font-medium w-full text-center text-white rounded-lg bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:opacity-90"
        onClick={() => onStartLearning(id)}
      >
        Start Learning
      </button>
    </CardFooter>
  </Card>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const SubjectsPage: FC = () => {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<{
    id: string;
    gradeTitle: string;
  } | null>(null);

  const { data, isLoading } = useFetchGradesQuery({ page: 1, limit: 200 });
  const grades = data?.results || [];

  const onHandleSubjectClick = (id: string) => router.push(`/subjects/${id}`);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl py-4 m-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Pick Your Subject and Let&apos;s Get Learning!
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
          Explore courses and resources just for you! Pick your subject to begin
          <br className="hidden sm:block" />
          an exciting and personalized learning adventure!
        </h3>
      </div>

      {isLoading ? (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-16 lg:px-10 rounded-3xl bg-lightgrey grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="flex flex-col m-2 bg-white">
              <CardContent className="flex-grow p-6">
                <div className="h-16 flex items-center justify-center">
                  <Skeleton circle height={32} width={32} />
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">
                  <Skeleton width="60%" />
                </h2>
                <p className="text-center text-muted-foreground">
                  <Skeleton count={3} width="80%" />
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Skeleton height={40} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-8 pb-10">
          {grades.map((grade) => (
            <div
              key={grade.id}
              className="mx-auto max-w-7xl px-4 py-8 sm:py-16 lg:px-10 rounded-3xl bg-lightgrey"
            >
              {/* Grade heading */}
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-semibold text-center sm:text-left">
                  {grade.title}
                </h3>
              </div>

              {/* Subject cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {(grade.subjects ?? []).map((subject: any) => (
                  <SubjectCard
                    key={subject.id}
                    id={subject.id}
                    title={subject.title}
                    description={subject.description}
                    onStartLearning={onHandleSubjectClick}
                    onShowDetails={(id) =>
                      setSelectedSubject({ id, gradeTitle: grade.title })
                    }
                  />
                ))}

                {(!grade.subjects || grade.subjects.length === 0) && (
                  <p className="text-sm text-muted-foreground col-span-full">
                    No subjects available for this grade yet.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subject detail popup */}
      <SubjectDetailDialog
        subjectId={selectedSubject?.id ?? null}
        gradeTitle={selectedSubject?.gradeTitle ?? ""}
        onClose={() => setSelectedSubject(null)}
        onStartLearning={onHandleSubjectClick}
      />
    </div>
  );
};

export default SubjectsPage;
