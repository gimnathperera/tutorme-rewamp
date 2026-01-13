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

// filter by level title
interface TuitionRatesByLevelProps {
  levelTitle: string;
}

const TuitionRatesByLevelComponent: React.FC<TuitionRatesByLevelProps> = ({
  levelTitle,
}) => {
  const { data, error, isLoading } = useFetchTuitionRatesQuery({});

  if (isLoading) return <p>Loading tuition rates...</p>;
  if (error)
    return <p className="text-red-500">Failed to load tuition rates</p>;
  if (!data?.results?.length) return <p>No tuition rates found</p>;

  // Filter by level title
  const levelResults = data.results.filter(
    (item: any) =>
      item.level &&
      typeof item.level.title === "string" &&
      item.level.title.trim().toLowerCase() === levelTitle.trim().toLowerCase(),
  );

  if (!levelResults.length)
    return <p>No tuition rates available for &quot;{levelTitle}&quot;</p>;

  // Group by grade
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
        fullTime: item.fullTimeTuitionRate || [],
        partTime: item.partTimeTuitionRate || [],
        gov: item.govTuitionRate || [],
      });

      return acc;
    },
    {} as Record<string, any>,
  );

  return (
    <div className="space-y-8">
      <Card className="p-10">
        <div className="flex justify-center flex-col items-center">
          <p className="text-3xl font-semibold">Tuition Rates - {levelTitle}</p>
          <p className="text-[#EF4350] font-bold">Tuition Rates</p>
        </div>

        {Object.values(groupedByGrade).map((gradeGroup: any, idx: number) => (
          <div key={idx} className="mt-4">
            <h3 className="text-lg font-semibold mb-4">
              {gradeGroup.gradeTitle}
            </h3>
            <Table className="mt-2">
              <TableHeader>
                <TableRow className="text-white font-bold">
                  <TableHead className="bg-[#FCA627] w-1/4">Subjects</TableHead>
                  <TableHead className="bg-[#FCA627] w-1/4">
                    Full Time (Min - Max)
                  </TableHead>
                  <TableHead className="bg-[#FCA627] w-1/4">
                    Part Time (Min - Max)
                  </TableHead>
                  <TableHead className="bg-[#FCA627] w-1/4">
                    Government (Min - Max)
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
                      Rs.{subject.fullTime?.[0]?.minimumRate || "N/A"} - Rs.{" "}
                      {subject.fullTime?.[0]?.maximumRate || "N/A"}
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      Rs. {subject.partTime?.[0]?.minimumRate || "N/A"} - Rs.{" "}
                      {subject.partTime?.[0]?.maximumRate || "N/A"}
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      Rs. {subject.gov?.[0]?.minimumRate || "N/A"} - Rs.{" "}
                      {subject.gov?.[0]?.maximumRate || "N/A"}
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
