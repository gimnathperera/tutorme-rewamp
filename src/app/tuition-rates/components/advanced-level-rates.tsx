import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import React from "react";
import PartTimeImage from "../../../../public/images/tuitionRates/part-time-2.png";
import FullTimeImage from "../../../../public/images/tuitionRates/full-time-2.png";
import GovTeacherImage from "../../../../public/images/tuitionRates/ex-teacher-2.png";
import { advancedLevelRates } from "@/lib/data/tuition-rates/advanced-level";

const AdvancedLevelRates = () => {
  const data = advancedLevelRates;
  return (
    <div>
      <div className="space-y-4 m-10">
        <div className="flex space-y-4 justify-center items-center flex-col mb-10">
          <p className="text-[#FCA627]  text-[14px] font-bold">
            Affordable G.C.E Advanced Level Tuition Rates
          </p>
          <h2 className="text-3xl font-semibold">
            G.C.E Advanced Level Tuition Rates
          </h2>
          <p className="text-gray-600">
            For G.C.E. Advanced Level (A/L) Examination preparation in Sri
            Lanka, tuition costs typically range from LKR 1000-3500+ per hour
            for 2-3 hour sessions. A/L tuition is highly specialized and
            exam-oriented, focusing on in-depth syllabus mastery, complex
            problem-solving, and advanced exam techniques across all subjects.
            Given its importance for university entrance, tuition frequency and
            intensity increase significantly closer to the A/L examination.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="bg-[#FCA627] text-center text-lg font-semibold align-middle text-white">
                University Students
              </TableHead>
              <TableHead className="bg-[#FCA627]  text-center text-lg font-semibold align-middle text-white">
                Graduate Teachers
              </TableHead>
              <TableHead className="bg-[#FCA627]  text-center text-lg font-semibold align-middle text-white">
                Gov. School Teachers
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((rates) => (
              <TableRow key={rates.id}>
                <TableCell className="bg-[#28BBA3] text-white text-lg font-semibold">
                  {rates.level}
                </TableCell>
                <TableCell className="bg-gray-100 text-center align-middle">
                  {rates.universityStudentRate}
                </TableCell>
                <TableCell className="bg-gray-100 text-center align-middle">
                  {rates.graduateTeachersRate}
                </TableCell>
                <TableCell className="bg-gray-100 text-center align-middle">
                  {rates.governmentTeacherRate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdvancedLevelRates;
