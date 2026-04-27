"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";
import { Card } from "@/components/ui/card";

type Rate = { minimumRate: string | number; maximumRate: string | number };

interface TuitionRatesByLevelProps {
  levelTitle: string;
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
    <span className="inline-flex items-center gap-2 font-medium text-gray-700 whitespace-nowrap">
      <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
        <span className="uppercase tracking-wide text-[10px] opacity-70">
          Rs
        </span>
        <span>{formatRateValue(rate.minimumRate)}</span>
      </span>
      <span className="text-gray-400">-</span>
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
        <span className="uppercase tracking-wide text-[10px] opacity-70">
          Rs
        </span>
        <span>{formatRateValue(rate.maximumRate)}</span>
      </span>
    </span>
  );
}

const TuitionRatesByLevelComponent: React.FC<TuitionRatesByLevelProps> = ({
  levelTitle,
}) => {
  const { data, error, isLoading } = useFetchTuitionRatesQuery({});

  if (isLoading) return <p>Loading tuition rates...</p>;
  if (error)
    return <p className="text-red-500">Failed to load tuition rates</p>;
  if (!data?.results?.length) return <p>No tuition rates found</p>;

  const levelResults = data.results.filter(
    (item: any) =>
      item.level &&
      typeof item.level.title === "string" &&
      item.level.title.trim().toLowerCase() === levelTitle.trim().toLowerCase(),
  );

  if (!levelResults.length)
    return <p>No tuition rates available for &quot;{levelTitle}&quot;</p>;

  const groupedByGrade = levelResults.reduce(
    (acc: any, item: any) => {
      const gradeId = item.grade?.id || "unknown";
      if (!acc[gradeId]) {
        acc[gradeId] = {
          gradeTitle: item.grade?.title || "Unknown Grade",
          subjects: [],
        };
      }

      acc[gradeId].subjects.push({
        title: item.subject?.title || "N/A",
        universityStudentsRate: item.universityStudentsRate,
        partTimeTutorRate: item.partTimeTutorRate,
        fullTimeTutorRate: item.fullTimeTutorRate,
        moeTeacherRate: item.moeTeacherRate,
      });

      return acc;
    },
    {} as Record<string, any>,
  );

  return (
    <div className="space-y-8">
      <Card className="p-10">
        <div className="flex justify-center flex-col items-center">
          <p className="text-4xl font-bold">Tuition Rates - {levelTitle}</p>
          <p className="text-[#EF4350] font-bold">Tuition Rates</p>
        </div>

        {Object.values(groupedByGrade).map((gradeGroup: any, idx: number) => (
          <div key={idx} className="mt-4">
            <h3 className="text-3xl font-bold mb-4">{gradeGroup.gradeTitle}</h3>
            <Table className="mt-2">
              <TableHeader>
                <TableRow className="text-white font-bold">
                  <TableHead className="bg-[#FCA627] w-1/5 whitespace-nowrap">
                    Subjects
                  </TableHead>
                  <TableHead className="bg-[#FCA627] w-1/5 whitespace-nowrap">
                    University Students
                  </TableHead>
                  <TableHead className="bg-[#FCA627] w-1/5 whitespace-nowrap">
                    Part Time Tutor
                  </TableHead>
                  <TableHead className="bg-[#FCA627] w-1/5 whitespace-nowrap">
                    Full Time Tutor
                  </TableHead>
                  <TableHead className="bg-[#FCA627] w-1/5 whitespace-nowrap">
                    Ex / Current MOE Teachers
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="py-10">
                {gradeGroup.subjects.map((subject: any, subIdx: number) => (
                  <TableRow key={subIdx}>
                    <TableCell className="bg-[#28BBA3] text-white">
                      {subject.title}
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      <RateCell rate={subject.universityStudentsRate} />
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      <RateCell rate={subject.partTimeTutorRate} />
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      <RateCell rate={subject.fullTimeTutorRate} />
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      <RateCell rate={subject.moeTeacherRate} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default TuitionRatesByLevelComponent;
