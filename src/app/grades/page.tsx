"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Icon from "@/components/shared/icon";
import {
  useFetchGradesQuery,
  useFetchGradeByIdQuery,
} from "@/store/api/splits/grades";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const GRADE_LIMIT = 1000;

// ── Grade detail popup ────────────────────────────────────────────────────────
interface GradeDetailDialogProps {
  gradeId: string | null;
  onClose: () => void;
  onStartLearning: (id: string) => void;
}

const GradeDetailDialog: FC<GradeDetailDialogProps> = ({
  gradeId,
  onClose,
  onStartLearning,
}) => {
  const { data, isLoading } = useFetchGradeByIdQuery(gradeId!, {
    skip: !gradeId,
  });

  const subjects: { id: string; title: string; description: string }[] =
    data?.subjects ?? [];

  return (
    <Dialog.Root open={!!gradeId} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel */}
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl flex flex-col max-h-[85vh] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl shrink-0">
            <div className="bg-white/20 rounded-full p-2">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <Dialog.Title className="flex-1 text-white font-semibold text-xl leading-snug">
              {isLoading ? (
                <Skeleton
                  width={200}
                  baseColor="#ffffff40"
                  highlightColor="#ffffff60"
                />
              ) : (
                (data?.title ?? "Grade Details")
              )}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-full p-1.5 bg-white/20 hover:bg-white/30 transition-colors text-white">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {/* Description */}
            {isLoading ? (
              <Skeleton count={4} />
            ) : data?.description ? (
              <p className="text-sm text-gray-600 leading-relaxed">
                {data.description}
              </p>
            ) : null}

            {/* Subjects accordion */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Subjects
              </h3>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} height={48} borderRadius={8} />
                  ))}
                </div>
              ) : subjects.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No subjects available for this grade.
                </p>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {subjects.map((subject) => (
                    <AccordionItem
                      key={subject.id}
                      value={subject.id}
                      className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50/60"
                    >
                      <AccordionTrigger className="px-4 py-3 text-sm font-medium text-gray-800 hover:no-underline hover:bg-gray-100 transition-colors">
                        {subject.title}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-1">
                        <p className="text-sm text-gray-500 leading-relaxed mb-3">
                          {subject.description || "No description available."}
                        </p>
                        <Link
                          href={`/subjects/${subject.id}`}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          View subject <ChevronRight className="w-3 h-3" />
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 shrink-0">
            <button
              className="w-full py-3 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow hover:shadow-md"
              onClick={() => {
                if (gradeId) onStartLearning(gradeId);
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
interface GradeCardProps {
  id: string;
  title: string;
  description: string;
  onStartLearning: (id: string) => void;
  onShowDetails: (id: string) => void;
}

const GradeCard: FC<GradeCardProps> = ({
  id,
  title,
  description,
  onStartLearning,
  onShowDetails,
}) => (
  <Card className="flex flex-col m-2 bg-white">
    <CardContent className="flex-grow p-6">
      {/* Icon */}
      <div className="h-16 flex items-center justify-center">
        <Icon name="ScrollText" size={32} />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>

      {/* Description — always clamped to 4 lines */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
          {description}
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
        className="py-3 px-5 text-base disabled:opacity-50 font-semibold w-full text-center text-white rounded-lg bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:opacity-90"
        onClick={() => onStartLearning(id)}
      >
        Start Learning
      </button>
    </CardFooter>
  </Card>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const GradesPage: FC = () => {
  const router = useRouter();
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);

  const { data, isLoading } = useFetchGradesQuery({
    page: 1,
    limit: GRADE_LIMIT,
  });

  const grades = (data?.results || []).slice().sort((a, b) => {
    const getPriority = (title: string) => {
      if (/grade\s*\d+/i.test(title)) return 1;
      if (/o\/?l/i.test(title)) return 2;
      if (/a\/?l/i.test(title)) return 3;
      if (/extracurricular activities/i.test(title)) return 4;
      if (/other activities/i.test(title)) return 5;
      return 99;
    };

    const priorityA = getPriority(a.title);
    const priorityB = getPriority(b.title);

    // Step 1: category sorting
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Step 2: numeric sorting inside "Grade"
    if (priorityA === 1) {
      const numA = Number(a.title.match(/\d+/)?.[0] ?? 0);
      const numB = Number(b.title.match(/\d+/)?.[0] ?? 0);
      return numA - numB;
    }

    return 0;
  });

  const onHandleGradeClick = (id: string) => router.push(`/grades/${id}`);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl py-4 m-3">
        <h2 className="text-4xl font-bold text-center">
          Pick Your Grade and Let&apos;s Get Learning!
        </h2>
        <h3 className="text-xl font-normal text-center pt-4 sm:pt-10 opacity-50">
          Explore courses and resources just for you! Pick your grade to begin
          <br className="hidden sm:block" />
          an exciting and personalized learning adventure!
        </h3>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-16 lg:px-10 rounded-3xl bg-lightgrey grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
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
            ))
          : grades.map(({ id, title, description }) => (
              <GradeCard
                key={id}
                id={id}
                title={title}
                description={description}
                onStartLearning={onHandleGradeClick}
                onShowDetails={setSelectedGradeId}
              />
            ))}
      </div>

      {/* Detail popup */}
      <GradeDetailDialog
        gradeId={selectedGradeId}
        onClose={() => setSelectedGradeId(null)}
        onStartLearning={onHandleGradeClick}
      />
    </div>
  );
};

export default GradesPage;
