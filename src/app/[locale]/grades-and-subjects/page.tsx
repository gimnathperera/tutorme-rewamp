/* eslint-disable unused-imports/no-unused-vars */
"use client";

import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Icon from "@/components/shared/icon";
import {
  useFetchSubjectsForGradesMutation,
  useFetchGradesQuery,
  useFetchGradeByIdQuery,
} from "@/store/api/splits/grades";
import { useTranslateItems } from "@/hooks/useTranslateItems";
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
import { Grade, Subject } from "@/types/response-types";

const GRADES_PAGE_SIZE = 12;
const SUBJECTS_PAGE_SIZE = 10;
const UNKNOWN_AL_STREAM_ORDER = AL_STREAM_ORDER.length;

const STREAM_SUBJECT_ORDER: { pattern: RegExp; order: string[] }[] = [
  {
    pattern: /biological\s+science/i,
    order: [
      "biology",
      "physics",
      "chemistry",
      "agriculture",
      "general information technology",
      "general english",
      "common general test",
    ],
  },
  {
    pattern: /commerce/i,
    order: [
      "accounting",
      "economics",
      "business studies",
      "ict (advanced level)",
      "general information technology",
      "general english",
      "common general test",
    ],
  },
];

const sortSubjects = (gradeTitle: string, subjects: Subject[]) => {
  const stream = STREAM_SUBJECT_ORDER.find(({ pattern }) =>
    pattern.test(gradeTitle),
  );
  if (!stream) return subjects;
  return [...subjects].sort((a, b) => {
    const ai = stream.order.indexOf(a.title.toLowerCase());
    const bi = stream.order.indexOf(b.title.toLowerCase());
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
};

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
  gradeDetailsFallback: string;
  subjectsHeading: string;
  noSubjectsAvailable: string;
  noDescriptionAvailable: string;
  loadingMoreSubjects: string;
  loadMoreSubjects: string;
}

const GradeDetailDialog: FC<GradeDetailDialogProps> = ({
  gradeId,
  onClose,
  gradeDetailsFallback,
  subjectsHeading,
  noSubjectsAvailable,
  noDescriptionAvailable,
  loadingMoreSubjects,
  loadMoreSubjects,
}) => {
  const { data, isLoading } = useFetchGradeByIdQuery(gradeId!, {
    skip: !gradeId,
  });
  const [currentSubjectsPage, setCurrentSubjectsPage] = useState(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsTotalPages, setSubjectsTotalPages] = useState(0);
  const [subjectsTotalResults, setSubjectsTotalResults] = useState(0);
  const [fetchSubjectsForGrades, { isLoading: isSubjectsLoading }] =
    useFetchSubjectsForGradesMutation();
  const subjectsObserverRef = useRef<IntersectionObserver | null>(null);
  const isRequestingNextSubjectsPageRef = useRef(false);
  const mergedSubjectPagesRef = useRef(new Set<number>());
  const hasMoreSubjects =
    subjectsTotalPages > 0 && currentSubjectsPage < subjectsTotalPages;

  // Translate grade data (title + description shown in dialog header/body)
  const gradeDataArray = data ? [data] : [];
  const translatedGradeDataArray = useTranslateItems(
    gradeDataArray,
    (grade) => [grade.title, grade.description ?? ""],
    (grade, [title, description]) => ({ ...grade, title, description }),
  );
  const displayGradeData = translatedGradeDataArray[0] ?? data;

  // Translate subject titles and descriptions
  const translatedSubjects = useTranslateItems(
    subjects,
    (subject) => [subject.title, subject.description ?? ""],
    (subject, [title, description]) => ({ ...subject, title, description }),
  );

  useEffect(() => {
    setCurrentSubjectsPage(1);
    setSubjects([]);
    setSubjectsTotalPages(0);
    setSubjectsTotalResults(0);
    isRequestingNextSubjectsPageRef.current = false;
    mergedSubjectPagesRef.current.clear();
  }, [gradeId]);

  useEffect(() => {
    if (!gradeId) return;

    const loadSubjects = async () => {
      const result = await fetchSubjectsForGrades({
        gradeIds: [gradeId],
        page: currentSubjectsPage,
        limit: SUBJECTS_PAGE_SIZE,
        sortBy: "title:asc",
      });

      if (!("data" in result) || !result.data) {
        isRequestingNextSubjectsPageRef.current = false;
        return;
      }

      const responsePage = result.data.page || currentSubjectsPage;

      if (mergedSubjectPagesRef.current.has(responsePage)) {
        isRequestingNextSubjectsPageRef.current = false;
        return;
      }

      mergedSubjectPagesRef.current.add(responsePage);
      isRequestingNextSubjectsPageRef.current = false;

      const nextSubjects = result.data.results || result.data.subjects || [];

      setSubjects((previousSubjects) => {
        const subjectsById = new Map<string, Subject>();
        const subjectsToMerge =
          responsePage === 1
            ? nextSubjects
            : previousSubjects.concat(nextSubjects);

        subjectsToMerge.forEach((subject) => {
          subjectsById.set(subject.id, subject);
        });

        return sortSubjects(
          data?.title ?? "",
          Array.from(subjectsById.values()),
        );
      });

      setSubjectsTotalPages(result.data.totalPages || responsePage);
      setSubjectsTotalResults(
        result.data.totalResults || result.data.count || nextSubjects.length,
      );
    };

    loadSubjects();
  }, [currentSubjectsPage, data?.title, fetchSubjectsForGrades, gradeId]);

  const loadMoreSubjectsRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (subjectsObserverRef.current) {
        subjectsObserverRef.current.disconnect();
      }

      subjectsObserverRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasMoreSubjects &&
          !isSubjectsLoading &&
          !isRequestingNextSubjectsPageRef.current
        ) {
          isRequestingNextSubjectsPageRef.current = true;
          setCurrentSubjectsPage((page) => page + 1);
        }
      });

      if (node) {
        subjectsObserverRef.current.observe(node);
      }
    },
    [hasMoreSubjects, isSubjectsLoading],
  );

  return (
    <Dialog.Root open={!!gradeId} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel */}
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 grid max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-2xl bg-white shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header */}
          <div className="relative z-10 flex min-h-[76px] items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
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
                (displayGradeData?.title ?? gradeDetailsFallback)
              )}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-full p-1.5 bg-white/20 hover:bg-white/30 transition-colors text-white">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <div className="min-h-0 overflow-y-auto px-6 pb-5 pt-4 space-y-5 [scrollbar-gutter:stable]">
            {/* Description */}
            {isLoading ? (
              <Skeleton count={4} />
            ) : displayGradeData?.description ? (
              <p className="text-sm text-gray-600 leading-relaxed">
                {displayGradeData.description}
              </p>
            ) : null}

            {/* Subjects accordion */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
                {subjectsHeading}
              </h3>
              {isLoading || (isSubjectsLoading && subjects.length === 0) ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} height={48} borderRadius={8} />
                  ))}
                </div>
              ) : subjects.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  {noSubjectsAvailable}
                </p>
              ) : (
                <>
                  <Accordion type="single" collapsible className="space-y-2">
                    {translatedSubjects.map((subject) => (
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
                            {subject.description || noDescriptionAvailable}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <div
                    ref={loadMoreSubjectsRef}
                    className="flex min-h-14 items-center justify-center py-4"
                  >
                    {isSubjectsLoading && subjects.length > 0 ? (
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                        <div className="w-5 h-5 rounded-full border-2 border-primary-700 border-t-transparent animate-spin" />
                        {loadingMoreSubjects}
                      </div>
                    ) : hasMoreSubjects ? (
                      <span className="sr-only">{loadMoreSubjects}</span>
                    ) : subjects.length > 0 ? (
                      <div></div>
                    ) : null}
                  </div>
                </>
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
  seeMoreLabel: string;
}

const GradeCard: FC<GradeCardProps> = ({
  title,
  description,
  onShowDetails,
  seeMoreLabel,
}) => (
  <Card className="flex h-full flex-col bg-white">
    <CardContent className="flex-grow p-5">
      {/* Icon */}
      <div className="flex h-12 items-center justify-center">
        <Icon name="ScrollText" size={32} />
      </div>

      {/* Title */}
      <h2 className="mb-2 text-center text-xl font-semibold">{title}</h2>

      {/* Description - always clamped to 4 lines */}
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
        {seeMoreLabel}
      </button>
    </CardFooter>
  </Card>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const GradesPage: FC = () => {
  const t = useTranslations("gradesAndSubjects");
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedGrades, setLoadedGrades] = useState<Grade[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isRequestingNextPageRef = useRef(false);
  const mergedPagesRef = useRef(new Set<number>());

  const { data, isLoading, isFetching } = useFetchGradesQuery({
    page: currentPage,
    limit: GRADES_PAGE_SIZE,
    sortBy: "title:asc",
  });

  useEffect(() => {
    if (!data) return;

    const responsePage = data.page || currentPage;

    if (mergedPagesRef.current.has(responsePage)) {
      isRequestingNextPageRef.current = false;
      return;
    }

    mergedPagesRef.current.add(responsePage);
    isRequestingNextPageRef.current = false;

    setLoadedGrades((previousGrades) => {
      const gradesById = new Map<string, (typeof previousGrades)[number]>();
      const gradesToMerge =
        responsePage === 1
          ? data.results || []
          : previousGrades.concat(data.results || []);

      gradesToMerge.forEach((grade) => {
        gradesById.set(grade.id, grade);
      });

      return Array.from(gradesById.values());
    });
  }, [currentPage, data]);

  const sortedGrades = useMemo(() => {
    return loadedGrades.slice().sort((a, b) => {
      if (isAdvancedLevelTitle(a.title) && isAdvancedLevelTitle(b.title)) {
        const streamOrderDiff =
          getAlStreamOrder(a.title) - getAlStreamOrder(b.title);
        if (streamOrderDiff !== 0) return streamOrderDiff;
        return a.title.localeCompare(b.title);
      }

      const priorityA = getGradePriority(a.title);
      const priorityB = getGradePriority(b.title);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      if (priorityA === 1) {
        const numA = Number(a.title.match(/\d+/)?.[0] ?? 0);
        const numB = Number(b.title.match(/\d+/)?.[0] ?? 0);
        return numA - numB;
      }

      return a.title.localeCompare(b.title);
    });
  }, [loadedGrades]);

  // Translate grade titles and descriptions for non-English locales
  const grades = useTranslateItems(
    sortedGrades,
    (grade) => [grade.title, grade.description ?? ""],
    (grade, [title, description]) => ({ ...grade, title, description }),
  );

  const hasMoreGrades = data?.totalPages
    ? currentPage < data.totalPages
    : false;

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasMoreGrades &&
          !isFetching &&
          !isRequestingNextPageRef.current
        ) {
          isRequestingNextPageRef.current = true;
          setCurrentPage((page) => page + 1);
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [hasMoreGrades, isFetching],
  );

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-5 max-w-7xl text-center">
        <h2 className="text-4xl font-bold text-center">{t("pageTitle")}</h2>
        <h3 className="mx-auto mt-3 max-w-2xl text-xl font-normal opacity-50">
          {t("pageSubtitle")}
        </h3>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-10 lg:px-10 rounded-3xl bg-lightgrey grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {isLoading && loadedGrades.length === 0
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
                seeMoreLabel={t("seeMore")}
              />
            ))}
      </div>

      <div
        ref={loadMoreRef}
        className="mx-auto flex min-h-20 max-w-7xl items-center justify-center py-6"
      >
        {isFetching && loadedGrades.length > 0 ? (
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
            <div className="w-5 h-5 rounded-full border-2 border-primary-700 border-t-transparent animate-spin" />
            {t("loadingMoreGrades")}
          </div>
        ) : hasMoreGrades ? (
          <span className="sr-only">{t("loadMoreGrades")}</span>
        ) : loadedGrades.length > 0 ? (
          <div></div>
        ) : null}
      </div>

      {/* Detail popup */}
      <GradeDetailDialog
        gradeId={selectedGradeId}
        onClose={() => setSelectedGradeId(null)}
        gradeDetailsFallback={t("gradeDetails")}
        subjectsHeading={t("subjectsHeading")}
        noSubjectsAvailable={t("noSubjectsAvailable")}
        noDescriptionAvailable={t("noDescriptionAvailable")}
        loadingMoreSubjects={t("loadingMoreSubjects")}
        loadMoreSubjects={t("loadMoreSubjects")}
      />
      <WhatsAppButton />
    </div>
  );
};

export default GradesPage;
