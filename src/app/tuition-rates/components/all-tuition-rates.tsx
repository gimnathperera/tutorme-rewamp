"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefCallback } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import {
  useFetchGradesWithCountsQuery,
  useFetchTuitionRatesByGradeQuery,
} from "@/store/api/splits/tuition-rates";
import { TuitionRateItem } from "@/types/response-types";

type Rate = { minimumRate: string | number; maximumRate: string | number };
type GradeWithCount = {
  _id?: string;
  id?: string;
  title: string;
  tuitionRateCount?: number;
};
type TuitionRatePagination = {
  page: number;
  totalPages: number;
  totalResults: number;
};

const TUITION_RATES_PAGE_SIZE = 10;

function getTuitionRateKey(rate: TuitionRateItem) {
  return (
    rate._id ||
    (rate as { id?: string }).id ||
    `${rate.grade?.id || "unknown-grade"}-${rate.subject?.id || "unknown-subject"}`
  );
}

function formatRateValue(value: string | number) {
  const numericValue = typeof value === "number" ? value : Number(value);

  if (Number.isFinite(numericValue)) {
    return new Intl.NumberFormat("en-US").format(numericValue);
  }

  return String(value);
}

function RateCell({ rate }: { rate?: Rate }) {
  if (!rate?.minimumRate && !rate?.maximumRate) {
    return <span className="text-gray-400 italic text-sm">N/A</span>;
  }

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-gray-700">
      <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
        <span className="tracking-wide text-[10px] opacity-70">Rs</span>
        <span>{formatRateValue(rate.minimumRate)}</span>
      </span>

      <span className="text-gray-400">-</span>

      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
        <span className="tracking-wide text-[10px] opacity-70">Rs</span>
        <span>{formatRateValue(rate.maximumRate)}</span>
      </span>
    </span>
  );
}

function TuitionRateTable({
  isInitialLoading,
  items,
}: {
  isInitialLoading: boolean;
  items: TuitionRateItem[];
}) {
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-8 h-8 rounded-full border-4 border-[#FCA627] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="px-6 py-12 text-center text-sm text-gray-500">
        No tuition rates found for this grade.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1120px] table-auto text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-5 py-3 font-semibold text-gray-600 min-w-[220px] whitespace-nowrap">
              Subject
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 min-w-[220px] whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#28BBA3] inline-block" />
                University Students
              </span>
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 min-w-[220px] whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FCA627] inline-block" />
                Part Time Tutor
              </span>
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 min-w-[220px] whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4350] inline-block" />
                Full Time Tutor
              </span>
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 min-w-[240px]">
              <span className="inline-flex items-start gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#434eef] inline-block" />
                <span className="leading-5">
                  Gov/International Teachers <br /> (Ex / Current)
                </span>
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, idx) => (
            <tr
              key={item._id || idx}
              className={`border-b border-gray-100 transition-colors duration-150 hover:bg-[#FCA627]/5 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"
              }`}
            >
              <td className="min-w-[220px] px-5 py-4 align-middle">
                <span className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28BBA3] flex-shrink-0" />
                  <span className="font-semibold text-gray-800">
                    {item.subject?.title || "Unknown Subject"}
                  </span>
                </span>
              </td>

              <td className="min-w-[220px] px-5 py-4 align-middle">
                <RateCell rate={item.universityStudentsRate} />
              </td>

              <td className="min-w-[220px] px-5 py-4 align-middle">
                <RateCell rate={item.partTimeTutorRate} />
              </td>

              <td className="min-w-[220px] px-5 py-4 align-middle">
                <RateCell rate={item.fullTimeTutorRate} />
              </td>

              <td className="min-w-[240px] px-5 py-4 align-middle">
                <RateCell rate={item.moeTeacherRate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GradeTuitionRatesItem({
  grade,
  itemValue,
  isActive,
  registerTrigger,
}: {
  grade: GradeWithCount;
  itemValue: string;
  isActive: boolean;
  registerTrigger: RefCallback<HTMLButtonElement>;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [tuitionRates, setTuitionRates] = useState<TuitionRateItem[]>([]);
  const [pagination, setPagination] = useState<TuitionRatePagination | null>(
    null,
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isRequestingNextPageRef = useRef(false);
  const mergedPagesRef = useRef(new Set<number>());
  const gradeId = grade.id || (grade as { _id?: string })._id;

  const {
    data: tuitionRatesData,
    isLoading: isRatesLoading,
    isFetching: isRatesFetching,
    error,
  } = useFetchTuitionRatesByGradeQuery(
    {
      gradeId: gradeId || "",
      page: currentPage,
      limit: TUITION_RATES_PAGE_SIZE,
    },
    {
      skip: !gradeId || !isActive || grade.tuitionRateCount === 0,
    },
  );
  const hasMoreRates = pagination ? currentPage < pagination.totalPages : false;
  const visibleCount =
    grade.tuitionRateCount ?? pagination?.totalResults ?? tuitionRates.length;

  useEffect(() => {
    setCurrentPage(1);
    setTuitionRates([]);
    setPagination(null);
    isRequestingNextPageRef.current = false;
    mergedPagesRef.current.clear();
  }, [gradeId]);

  useEffect(() => {
    if (!tuitionRatesData) return;

    const responsePage = tuitionRatesData.page || currentPage;

    if (mergedPagesRef.current.has(responsePage)) {
      isRequestingNextPageRef.current = false;
      return;
    }

    mergedPagesRef.current.add(responsePage);
    isRequestingNextPageRef.current = false;

    setTuitionRates((prevRates) => {
      const nextRates = tuitionRatesData.results || [];
      const ratesById = new Map<string, TuitionRateItem>();

      const ratesToMerge = responsePage === 1 ? nextRates : prevRates.concat(nextRates);

      ratesToMerge.forEach((rate) => {
        ratesById.set(getTuitionRateKey(rate), rate);
      });

      return Array.from(ratesById.values());
    });

    setPagination({
      page: responsePage,
      totalPages: tuitionRatesData.totalPages || currentPage,
      totalResults: tuitionRatesData.totalResults || 0,
    });
  }, [currentPage, tuitionRatesData]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!isActive) {
        return;
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasMoreRates &&
          !isRatesFetching &&
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
    [hasMoreRates, isActive, isRatesFetching],
  );

  return (
    <AccordionItem
      value={itemValue}
      className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white"
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={registerTrigger}
          className="flex w-full min-w-0 items-center justify-between gap-3 px-3 sm:px-5 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-left [&[data-state=open]_.chevron]:rotate-180"
        >
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="bg-white/20 rounded-full p-1.5 shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            <h2 className="text-white font-bold text-base sm:text-lg tracking-wide min-w-0 truncate">
              {grade.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center bg-white/20 text-white text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap">
              {visibleCount} item
              {visibleCount === 1 ? "" : "s"}
            </span>

            <ChevronDown className="chevron w-5 h-5 text-white shrink-0 transition-transform duration-300" />
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionContent>
        {error && tuitionRates.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm font-medium text-red-500">
            Failed to load tuition rates for this grade.
          </div>
        ) : (
          <>
            <TuitionRateTable
              isInitialLoading={
                isRatesLoading &&
                tuitionRates.length === 0 &&
                grade.tuitionRateCount !== 0
              }
              items={tuitionRates}
            />

            <div
              ref={loadMoreRef}
              className="flex min-h-16 items-center justify-center py-5"
            >
              {isRatesFetching && tuitionRates.length > 0 ? (
                <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                  <div className="w-5 h-5 rounded-full border-2 border-[#FCA627] border-t-transparent animate-spin" />
                  Loading more tuition rates...
                </div>
              ) : error ? (
                <p className="text-sm font-medium text-red-500">
                  Failed to load more tuition rates.
                </p>
              ) : hasMoreRates ? (
                <span className="sr-only">Load more tuition rates</span>
              ) : tuitionRates.length > 0 ? (
                <p className="text-sm text-gray-400">
                  Showing {tuitionRates.length}
                  {pagination?.totalResults
                    ? ` of ${pagination.totalResults}`
                    : ""}{" "}
                  tuition rates
                </p>
              ) : null}
            </div>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function TuitionRatesByGrade() {
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(
    undefined,
  );
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());

  const { data: gradesData, isLoading: isGradesLoading } =
    useFetchGradesWithCountsQuery();
  const grades = useMemo(() => gradesData?.grades || [], [gradesData]);

  useEffect(() => {
    if (activeAccordion === undefined && grades.length > 0) {
      const firstGrade = grades[0] as GradeWithCount;
      setActiveAccordion(firstGrade.id || firstGrade._id || "grade-0");
    }
  }, [activeAccordion, grades]);

  const registerTrigger = useCallback(
    (value: string, node: HTMLButtonElement | null) => {
      if (node) {
        triggerRefs.current.set(value, node);
      } else {
        triggerRefs.current.delete(value);
      }
    },
    [],
  );

  const handleAccordionChange = useCallback((value: string | undefined) => {
    setActiveAccordion(value);

    if (!value) return;

    requestAnimationFrame(() => {
      triggerRefs.current.get(value)?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    });
  }, []);

  if (isGradesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#FCA627] border-t-transparent animate-spin" />
        <p className="text-gray-500 font-medium">Loading tuition rates...</p>
      </div>
    );
  }

  if (!grades.length) {
    return <p>No grades found</p>;
  }

  return (
    <div className="px-2 sm:px-0">
      <Accordion
        type="single"
        collapsible
        value={activeAccordion}
        onValueChange={handleAccordionChange}
        className="space-y-3"
      >
        {grades.map((grade: GradeWithCount, idx: number) => {
          const itemValue = grade.id || grade._id || `grade-${idx}`;

          return (
            <GradeTuitionRatesItem
              key={itemValue}
              grade={grade}
              itemValue={itemValue}
              isActive={activeAccordion === itemValue}
              registerTrigger={(node) => registerTrigger(itemValue, node)}
            />
          );
        })}
      </Accordion>
    </div>
  );
}
