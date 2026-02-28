"use client";

import { useState } from "react";
import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

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
  const [page, setPage] = useState<number>(1);
  const limit = 20000;

  const { data, isLoading, error } = useFetchTuitionRatesQuery({ page, limit });

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
  const totalResults = data?.totalResults ?? results.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / limit));

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

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };
  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return (
    <div className="space-y-8 px-2 sm:px-0">
      {Object.values(groupedData).map((gradeGroup, idx) => (
        <div
          key={gradeGroup.grade?.id || `grade-${idx}`}
          className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white"
        >
          {/* Grade Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="bg-white/20 rounded-full p-1.5">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg tracking-wide">
              {gradeGroup.grade?.title || "Unknown Grade"}
            </h2>
            <span className="ml-auto bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {gradeGroup.subjects.length} Subject
              {gradeGroup.subjects.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Scrollable Table */}
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
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2 pb-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={handlePrev}
            className="flex items-center gap-1 border-gray-300 hover:border-[#FCA627] hover:text-[#FCA627] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-1.5 rounded-full">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={handleNext}
            className="flex items-center gap-1 border-gray-300 hover:border-[#FCA627] hover:text-[#FCA627] transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
