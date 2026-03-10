"use client";

import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";
import { BookOpen, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

type Rate = { minimumRate: string; maximumRate: string };
type SubjectRate = {
  title: string;
  fullTime: Rate[];
  partTime: Rate[];
  gov: Rate[];
};

type GradeGroup = {
  grade: { id: string; title: string } | null;
  subjects: SubjectRate[];
};

function RateCell({ rates }: { rates: Rate[] }) {
  const min = rates?.[0]?.minimumRate;
  const max = rates?.[0]?.maximumRate;
  if (!min && !max) {
    return <span className="text-gray-400 italic text-sm">N/A</span>;
  }
  return (
    <span className="inline-flex flex-col sm:flex-row sm:items-center gap-1 text-sm font-medium text-gray-700">
      <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full text-xs font-semibold">
        Rs. {min}
      </span>
      <span className="text-gray-400 hidden sm:inline">—</span>
      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-semibold">
        Rs. {max}
      </span>
    </span>
  );
}

export default function TuitionRatesByGrade() {
  const { data, isLoading, error } = useFetchTuitionRatesQuery({
    page: 1,
    limit: 20000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#FCA627] border-t-transparent animate-spin" />
        <p className="text-gray-500 font-medium">Loading tuition rates…</p>
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

  const results = data?.results || [];

  const groupedData: Record<string, GradeGroup> =
    results?.reduce(
      (acc: Record<string, GradeGroup>, item) => {
        const gradeTitle = item.grade?.title || "Unknown Grade";
        if (!acc[gradeTitle]) {
          acc[gradeTitle] = { grade: item.grade ?? null, subjects: [] };
        }
        acc[gradeTitle].subjects.push({
          title: item.subject?.title || "Unknown Subject",
          fullTime: item.fullTimeTuitionRate || [],
          partTime: item.partTimeTuitionRate || [],
          gov: item.govTuitionRate || [],
        });
        return acc;
      },
      {} as Record<string, GradeGroup>,
    ) || {};

  const gradeEntries = Object.values(groupedData);

  // First grade is open by default
  const defaultValue =
    gradeEntries.length > 0
      ? gradeEntries[0].grade?.id || "grade-0"
      : undefined;

  return (
    <div className="px-2 sm:px-0">
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultValue}
        className="space-y-3"
      >
        {gradeEntries.map((gradeGroup, idx) => {
          const itemValue = gradeGroup.grade?.id || `grade-${idx}`;
          return (
            <AccordionItem
              key={itemValue}
              value={itemValue}
              className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white"
            >
              {/* Custom styled trigger that keeps the gradient header */}
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="flex w-full min-w-0 items-center gap-2 sm:gap-3 px-3 sm:px-5 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-left [&[data-state=open]_.chevron]:rotate-180">
                  <div className="bg-white/20 rounded-full p-1.5 shrink-0">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-white font-bold text-base sm:text-lg tracking-wide flex-1 min-w-0 truncate">
                    {gradeGroup.grade?.title || "Unknown Grade"}
                  </h2>
                  <span className="hidden sm:inline-flex bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full shrink-0">
                    {gradeGroup.subjects.length} Subject
                    {gradeGroup.subjects.length !== 1 ? "s" : ""}
                  </span>
                  <ChevronDown className="chevron w-5 h-5 text-white shrink-0 ml-1 transition-transform duration-300" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>

              {/* Table revealed with smooth slide animation */}
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-5 py-3 font-semibold text-gray-600 w-1/4">
                          Subject
                        </th>
                        <th className="text-left px-5 py-3 font-semibold text-gray-600 w-1/4">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#28BBA3] inline-block" />
                            Full-Time
                          </span>
                        </th>
                        <th className="text-left px-5 py-3 font-semibold text-gray-600 w-1/4">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FCA627] inline-block" />
                            Part-Time
                          </span>
                        </th>
                        <th className="text-left px-5 py-3 font-semibold text-gray-600 w-1/4">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4350] inline-block" />
                            Government
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradeGroup.subjects.map((subject, subIdx) => (
                        <tr
                          key={subIdx}
                          className={`border-b border-gray-100 transition-colors duration-150 hover:bg-[#FCA627]/5 ${
                            subIdx % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                          }`}
                        >
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#28BBA3] flex-shrink-0" />
                              <span className="font-semibold text-gray-800">
                                {subject.title}
                              </span>
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <RateCell rates={subject.fullTime} />
                          </td>
                          <td className="px-5 py-3.5">
                            <RateCell rates={subject.partTime} />
                          </td>
                          <td className="px-5 py-3.5">
                            <RateCell rates={subject.gov} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
