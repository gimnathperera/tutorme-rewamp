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

type LevelGroup = {
  level: { id: string; title: string } | null;
  grades: Record<string, GradeGroup>;
};

export default function TuitionRatesByLevel() {
  const { data, isLoading, error } = useFetchTuitionRatesQuery({
    page: 1,
    limit: 100,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load tuition rates</p>;

  const groupedData: Record<string, LevelGroup> =
    data?.results?.reduce((acc: Record<string, LevelGroup>, item) => {
      const levelTitle = item.level?.title || "Unknown Level";
      const gradeTitle = item.grade?.title || "Unknown Grade";

      // Create level group if not exists
      if (!acc[levelTitle]) {
        acc[levelTitle] = {
          level: item.level ?? null,
          grades: {},
        };
      }

      // Create grade group if not exists
      if (!acc[levelTitle].grades[gradeTitle]) {
        acc[levelTitle].grades[gradeTitle] = {
          grade: item.grade ?? null,
          subjects: [],
        };
      }

      // Add subject to the grade
      acc[levelTitle].grades[gradeTitle].subjects.push({
        title: item.subject?.title || "Unknown Subject",
        fullTime: item.fullTimeTuitionRate || [],
        partTime: item.partTimeTuitionRate || [],
        gov: item.govTuitionRate || [],
      });

      return acc;
    }, {} as Record<string, LevelGroup>) || {};

  return (
    <div className="space-y-6">
      {Object.values(groupedData).map((levelGroup, levelIdx) => (
        <Card key={levelGroup.level?.id || `level-${levelIdx}`} className="p-4">
          <CardContent>
            {/* Level Title */}
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-3xl font-semibold">
                {levelGroup.level?.title || "Unknown Level"}
              </h2>
              <p className="text-[#EF4350] font-bold">
                {levelGroup.level?.title || "Unknown Level"} Tuition Rates
              </p>
            </div>

            {/* Loop through grades in this level */}
            {Object.values(levelGroup.grades).map((gradeGroup, gradeIdx) => (
              <div
                key={gradeGroup.grade?.id || `grade-${gradeIdx}`}
                className="mt-4"
              >
                {/* Grade Title */}
                <h3 className="text-lg mt-10 font-semibold">
                  {gradeGroup.grade?.title || "Unknown Grade"}
                </h3>

                {/* Subjects Table */}
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow className="text-white font-bold ">
                      <TableHead className="bg-[#FCA627] w-1/4">
                        Subjects
                      </TableHead>
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
                    {gradeGroup.subjects.map((subject, subIdx) => (
                      <TableRow key={subIdx}>
                        <TableCell className="bg-[#28BBA3] text-white">
                          {subject.title}
                        </TableCell>
                        <TableCell className="bg-gray-100">
                          {subject.fullTime?.[0]?.minimumRate || "N/A"} -{" "}
                          {subject.fullTime?.[0]?.maximumRate || "N/A"}
                        </TableCell>
                        <TableCell className="bg-gray-100">
                          {subject.partTime?.[0]?.minimumRate || "N/A"} -{" "}
                          {subject.partTime?.[0]?.maximumRate || "N/A"}
                        </TableCell>
                        <TableCell className="bg-gray-100">
                          {subject.gov?.[0]?.minimumRate || "N/A"} -{" "}
                          {subject.gov?.[0]?.maximumRate || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
