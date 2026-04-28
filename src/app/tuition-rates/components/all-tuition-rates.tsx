"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";
import { Grade, TuitionRateItem } from "@/types/response-types";

type Rate = { minimumRate: string | number; maximumRate: string | number };

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

function TuitionRateTable({ items }: { items: TuitionRateItem[] }) {
  if (!items.length) {
    return (
      <div className="px-6 py-12 text-center text-sm text-gray-500">
        No tuition rates found for this grade.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-sm table-fixed">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-5 py-3 font-semibold text-gray-600 w-[24%] whitespace-nowrap">
              Subject
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 w-[19%] whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#28BBA3] inline-block" />
                University Students
              </span>
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 w-[19%] whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FCA627] inline-block" />
                Part Time Tutor
              </span>
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 w-[19%] whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4350] inline-block" />
                Full Time Tutor
              </span>
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 w-[19%] whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#434eef] inline-block" />
                Ex / Current MOE Teachers
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
              <td className="px-5 py-4 align-middle">
                <span className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28BBA3] flex-shrink-0" />
                  <span className="font-semibold text-gray-800 whitespace-nowrap">
                    {item.subject?.title || "Unknown Subject"}
                  </span>
                </span>
              </td>

              <td className="px-5 py-4 align-middle">
                <RateCell rate={item.universityStudentsRate} />
              </td>

              <td className="px-5 py-4 align-middle">
                <RateCell rate={item.partTimeTutorRate} />
              </td>

              <td className="px-5 py-4 align-middle">
                <RateCell rate={item.fullTimeTutorRate} />
              </td>

              <td className="px-5 py-4 align-middle">
                <RateCell rate={item.moeTeacherRate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TuitionRatesByGrade() {
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(
    undefined,
  );

  const { data: gradesData, isLoading: isGradesLoading } = useFetchGradesQuery({
    page: 1,
    limit: 1000,
  });

  const {
    data: tuitionRatesData,
    isLoading: isRatesLoading,
    error,
  } = useFetchTuitionRatesQuery({
    page: 1,
    limit: 1000,
  });

  const grades = useMemo(() => gradesData?.results || [], [gradesData]);
  const tuitionRates = tuitionRatesData?.results || [];

  const tuitionRatesByGradeId = useMemo(() => {
    return tuitionRates.reduce<Record<string, TuitionRateItem[]>>(
      (acc, item) => {
        const gradeId = item.grade?.id || "unknown";

        if (!acc[gradeId]) {
          acc[gradeId] = [];
        }

        acc[gradeId].push(item);
        return acc;
      },
      {},
    );
  }, [tuitionRates]);

  useEffect(() => {
    if (grades.length > 0 && activeAccordion === undefined) {
      setActiveAccordion(grades[0].id || "grade-0");
    }
  }, [grades, activeAccordion]);

  if (isGradesLoading || isRatesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#FCA627] border-t-transparent animate-spin" />
        <p className="text-gray-500 font-medium">Loading tuition rates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500 font-medium">
          Failed to load tuition rates.
        </p>
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
        onValueChange={setActiveAccordion}
        className="space-y-3"
      >
        {grades.map((grade: Grade, idx: number) => {
          const itemValue = grade.id || `grade-${idx}`;
          const gradeRates = tuitionRatesByGradeId[grade.id] || [];

          return (
            <AccordionItem
              key={itemValue}
              value={itemValue}
              className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="flex w-full min-w-0 items-center justify-between gap-3 px-3 sm:px-5 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-left [&[data-state=open]_.chevron]:rotate-180">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <div className="bg-white/20 rounded-full p-1.5 shrink-0">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>

                    <h2 className="text-white font-bold text-base sm:text-lg tracking-wide min-w-0 truncate">
                      {grade.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-flex items-center bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      {gradeRates.length} item
                      {gradeRates.length === 1 ? "" : "s"}
                    </span>

                    <ChevronDown className="chevron w-5 h-5 text-white shrink-0 transition-transform duration-300" />
                  </div>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>

              <AccordionContent>
                <TuitionRateTable items={gradeRates} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
