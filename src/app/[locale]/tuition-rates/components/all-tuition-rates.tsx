"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefCallback } from "react";
import { useTranslations } from "next-intl";
import { useTranslateItems } from "@/hooks/useTranslateItems";
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

const GRADE_SORT_KEYS = [
  "primary",
  "scholarship",
  "secondary",
  "gce ordinary",
  "physical science",
  "biological science",
  "commerce",
  "art",
  "technology",
  "sports",
  "communication",
  "computing",
  "multimedia",
  "language",
  "diploma",
  "cambridge ordinary",
  "cambridge advanced",
  "edexcel ordinary",
  "edexcel advanced",
];

function getGradeSortIndex(title: string): number {
  const normalized = title
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
  const idx = GRADE_SORT_KEYS.findIndex((key) => normalized.includes(key));
  return idx === -1 ? GRADE_SORT_KEYS.length : idx;
}

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

function MobileRateValue({ rate }: { rate?: Rate }) {
  if (!rate?.minimumRate && !rate?.maximumRate) {
    return <span className="text-gray-400 text-sm italic">N/A</span>;
  }
  const min = formatRateValue(rate.minimumRate);
  const max = formatRateValue(rate.maximumRate);
  const isSame = String(rate.minimumRate) === String(rate.maximumRate);
  return (
    <span className="text-sm font-semibold text-teal-600 whitespace-nowrap">
      Rs {min}
      {!isSame && <> – Rs {max}</>}
    </span>
  );
}

const MOBILE_TUTOR_ROWS = [
  { key: "universityStudentsRate" as const, label: "University Students", color: "#28BBA3" },
  { key: "partTimeTutorRate" as const, label: "Part Time Tutor", color: "#FCA627" },
  { key: "fullTimeTutorRate" as const, label: "Full Time Tutor", color: "#EF4350" },
  { key: "moeTeacherRate" as const, label: "Gov/International Teachers (Ex / Current)", color: "#434eef" },
];

function MobileRateCard({ item }: { item: TuitionRateItem }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {MOBILE_TUTOR_ROWS.map(({ key, label, color }) => (
        <div
          key={key}
          className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 last:border-0"
        >
          <div className="flex items-center gap-2.5 min-w-0 mr-3">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-700 leading-tight">{label}</span>
          </div>
          <MobileRateValue rate={item[key] as Rate | undefined} />
        </div>
      ))}
    </div>
  );
}

function MobileTuitionRates({ items }: { items: TuitionRateItem[] }) {
  const [selectedKey, setSelectedKey] = useState(() =>
    items[0] ? getTuitionRateKey(items[0]) : "",
  );
  const [displayKey, setDisplayKey] = useState(selectedKey);
  const [cardVisible, setCardVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedKey && items[0]) {
      const key = getTuitionRateKey(items[0]);
      setSelectedKey(key);
      setDisplayKey(key);
    }
  }, [items, selectedKey]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (key: string) => {
    setIsOpen(false);
    if (key === selectedKey) return;
    setSelectedKey(key);
    setCardVisible(false);
    setTimeout(() => {
      setDisplayKey(key);
      setCardVisible(true);
    }, 150);
  };

  const selectedItem = items.find((item) => getTuitionRateKey(item) === selectedKey) ?? items[0];
  const displayItem = items.find((item) => getTuitionRateKey(item) === displayKey) ?? items[0];

  return (
    <div className="px-4 py-4 space-y-3">
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <span>{selectedItem?.subject?.title ?? "Select subject"}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
            <div className="max-h-52 overflow-y-auto">
              {items.map((item) => {
                const key = getTuitionRateKey(item);
                const isSelected = key === selectedKey;
                return (
                  <div
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={`px-3 py-2.5 text-sm cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {item.subject?.title ?? "Unknown Subject"}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {displayItem && (
        <div
          className="transition-opacity duration-150"
          style={{ opacity: cardVisible ? 1 : 0 }}
        >
          <MobileRateCard item={displayItem} />
        </div>
      )}
    </div>
  );
}

function TuitionRateTable({
  isInitialLoading,
  items,
}: {
  isInitialLoading: boolean;
  items: TuitionRateItem[];
}) {
  const t = useTranslations("tuitionRates");

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
        {t("noRatesFound")}
      </div>
    );
  }

  return (
    <>
      {/* Mobile: subject picker + rate card */}
      <div className="md:hidden">
        <MobileTuitionRates items={items} />
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full min-w-[1120px] table-auto text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 font-semibold text-gray-600 min-w-[220px] whitespace-nowrap">
                {t("subject")}
              </th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 min-w-[220px] whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28BBA3] inline-block" />
                  {t("universityStudents")}
                </span>
              </th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 min-w-[220px] whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FCA627] inline-block" />
                  {t("partTimeTutor")}
                </span>
              </th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 min-w-[220px] whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4350] inline-block" />
                  {t("fullTimeTutor")}
                </span>
              </th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 min-w-[240px]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#434eef] inline-block flex-shrink-0" />
                  <span className="leading-5">
                    {t("govTeachersLine1")} <br /> {t("govTeachersLine2")}
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
    </>
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
  const t = useTranslations("tuitionRates");
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

  const translatedRates = useTranslateItems(
    tuitionRates,
    (rate) => [rate.subject?.title ?? ""],
    (rate, [subjectTitle]) => ({
      ...rate,
      subject: rate.subject
        ? { ...rate.subject, title: subjectTitle }
        : rate.subject,
    }),
  );

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

      const ratesToMerge =
        responsePage === 1 ? nextRates : prevRates.concat(nextRates);

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const sentinel = sentinelRef.current;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!container || !sentinel || !isActive) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasMoreRates &&
          !isRatesFetching &&
          !isRequestingNextPageRef.current
        ) {
          isRequestingNextPageRef.current = true;
          setCurrentPage((page) => page + 1);
        }
      },
      { root: container, threshold: 0.1 },
    );

    observerRef.current.observe(sentinel);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMoreRates, isActive, isRatesFetching]);

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
            {t("failedToLoad")}
          </div>
        ) : (
          <>
            <div
              ref={scrollContainerRef}
              className="max-h-[500px] overflow-y-auto"
            >
              <TuitionRateTable
                isInitialLoading={
                  isRatesLoading &&
                  tuitionRates.length === 0 &&
                  grade.tuitionRateCount !== 0
                }
                items={translatedRates}
              />

              <div
                ref={sentinelRef}
                className="flex min-h-4 items-center justify-center py-1"
              >
                {isRatesFetching && tuitionRates.length > 0 ? (
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                    <div className="w-5 h-5 rounded-full border-2 border-[#FCA627] border-t-transparent animate-spin" />
                    {t("loadingMore")}
                  </div>
                ) : error ? (
                  <p className="text-sm font-medium text-red-500">
                    {t("failedToLoadMore")}
                  </p>
                ) : hasMoreRates ? (
                  <span className="sr-only">Load more tuition rates</span>
                ) : tuitionRates.length > 0 ? (
                  <div></div>
                ) : null}
              </div>
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
  const grades = useMemo(
    () =>
      [...(gradesData?.grades || [])].sort(
        (a, b) => getGradeSortIndex(a.title) - getGradeSortIndex(b.title),
      ),
    [gradesData],
  );

  const translatedGrades = useTranslateItems(
    grades,
    (grade) => [grade.title],
    (grade, [title]) => ({ ...grade, title: title ?? grade.title }),
  );

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
        {translatedGrades.map((grade: GradeWithCount, idx: number) => {
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
