/* eslint-disable unused-imports/no-unused-vars */
"use client";

import { FC, useState } from "react";
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
import { X, BookOpen } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WhatsAppButton from "@/components/shared/whatapp-button";
import { AL_STREAM_ORDER } from "@/configs/options";

const GRADE_LIMIT = 1000;
const UNKNOWN_AL_STREAM_ORDER = AL_STREAM_ORDER.length;

const normalizeTitle = (title: string) => title.toLowerCase();

const getAlStreamOrder = (title: string) => {
  const normalizedTitle = normalizeTitle(title);
  const streamIndex = AL_STREAM_ORDER.findIndex((stream) =>
    normalizedTitle.includes(stream),
  );

  return streamIndex === -1 ? UNKNOWN_AL_STREAM_ORDER : streamIndex;
};

const isAdvancedLevelTitle = (title: string) =>
  /a\/?l|advanced\s+level/i.test(title);

const getGradePriority = (title: string) => {
  if (/grade\s*\d+/i.test(title)) return 1;
  if (/o\/?l|ordinary level/i.test(title)) return 2;
  if (isAdvancedLevelTitle(title)) return 3;
  if (/extracurricular activities/i.test(title)) return 4;
  if (/other activities/i.test(title)) return 5;
  return 99;
};

// ── Grade detail popup ────────────────────────────────────────────────────────
interface GradeDetailDialogProps {
  gradeId: string | null;
  onClose: () => void;
}

const GradeDetailDialog: FC<GradeDetailDialogProps> = ({
  gradeId,
  onClose,
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
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// ── Per-card component ────────────────────────────────────────────────────────
interface GradeCardProps {
  title: string;
  description: string;
  onShowDetails: () => void;
}

const GradeCard: FC<GradeCardProps> = ({
  title,
  description,
  onShowDetails,
}) => (
  <Card className="flex h-full flex-col bg-white">
    <CardContent className="flex-grow p-5">
      {/* Icon */}
      <div className="flex h-12 items-center justify-center">
        <Icon name="ScrollText" size={32} />
      </div>

      {/* Title */}
      <h2 className="mb-2 text-center text-xl font-semibold">{title}</h2>

      {/* Description — always clamped to 4 lines */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
          {description}
        </p>
      </div>
    </CardContent>

    <CardFooter className="mt-auto px-5 pb-5 pt-0">
      <button
        className="py-3 px-5 text-base disabled:opacity-50 font-semibold w-full text-center text-white rounded-lg bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:opacity-90"
        onClick={onShowDetails}
      >
        See More
      </button>
    </CardFooter>
  </Card>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const GradesPage: FC = () => {
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);

  const { data, isLoading } = useFetchGradesQuery({
    page: 1,
    limit: GRADE_LIMIT,
  });

  const grades = (data?.results || []).slice().sort((a, b) => {
    if (isAdvancedLevelTitle(a.title) && isAdvancedLevelTitle(b.title)) {
      const streamOrderDiff =
        getAlStreamOrder(a.title) - getAlStreamOrder(b.title);
      if (streamOrderDiff !== 0) return streamOrderDiff;
      return a.title.localeCompare(b.title);
    }

    const priorityA = getGradePriority(a.title);
    const priorityB = getGradePriority(b.title);

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

    return a.title.localeCompare(b.title);
  });

  return (
    <div className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto mb-5 max-w-7xl text-center">
        <h2 className="text-4xl font-bold text-center">
          Grades &amp; Subjects
        </h2>
        <h3 className="mx-auto mt-3 max-w-2xl text-xl font-normal opacity-50">
          Browse the available grades and explore the subjects offered in each
          one.
        </h3>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-10 lg:px-10 rounded-3xl bg-lightgrey grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
                title={title}
                description={description}
                onShowDetails={() => setSelectedGradeId(id)}
              />
            ))}
      </div>

      {/* Detail popup */}
      <GradeDetailDialog
        gradeId={selectedGradeId}
        onClose={() => setSelectedGradeId(null)}
      />
      <WhatsAppButton />
    </div>
  );
};

export default GradesPage;
