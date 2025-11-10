"use client";

import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function TuitionRatesByGrade() {
  const { data, isLoading, error } = useFetchTuitionRatesQuery({
    page: 1,
    limit: 100,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load tuition rates</p>;

  // Group by Grade
  const groupedData: Record<string, GradeGroup> =
    data?.results?.reduce((acc: Record<string, GradeGroup>, item) => {
      const gradeTitle = item.grade?.title || "Unknown Grade";

      if (!acc[gradeTitle]) {
        acc[gradeTitle] = {
          grade: item.grade ?? null,
          subjects: [],
        };
      }

      acc[gradeTitle].subjects.push({
        title: item.subject?.title || "Unknown Subject",
        fullTime: item.fullTimeTuitionRate || [],
        partTime: item.partTimeTuitionRate || [],
        gov: item.govTuitionRate || [],
      });

      return acc;
    }, {} as Record<string, GradeGroup>) || {};

  return (
    <div className="space-y-6">
      {Object.values(groupedData).map((gradeGroup, idx) => (
        <Card key={gradeGroup.grade?.id || `grade-${idx}`} className="p-4">
          <CardContent>
            {/* Grade Title */}
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-3xl font-semibold">
                {gradeGroup.grade?.title || "Unknown Grade"}
              </h2>
            </div>

            {/* Subjects Table */}
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-[#FCA627] w-1/4 text-white font-bold">
                    Subjects
                  </TableHead>
                  <TableHead className="bg-[#FCA627] w-1/4 text-white font-bold">
                    Full Time (Min - Max)
                  </TableHead>
                  <TableHead className="bg-[#FCA627] w-1/4 text-white font-bold">
                    Part Time (Min - Max)
                  </TableHead>
                  <TableHead className="bg-[#FCA627] w-1/4 text-white font-bold">
                    Government (Min - Max)
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {gradeGroup.subjects.map((subject, subIdx) => (
                  <TableRow key={subIdx}>
                    <TableCell className="bg-[#28BBA3] text-white">
                      {subject.title}
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      Rs. {subject.fullTime?.[0]?.minimumRate || "N/A"} - Rs.{" "}
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
