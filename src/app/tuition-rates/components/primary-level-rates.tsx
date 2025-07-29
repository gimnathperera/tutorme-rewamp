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
import { gradeOneToFiveRates } from "@/lib/data/tuition-rates/one-to-five";

const PrimaryLevelTuitionRates = () => {
  const data = gradeOneToFiveRates;
  return (
    <div>
      <div className="space-y-4 m-10">
        <div className="flex space-y-4 justify-center items-center flex-col mb-10">
          <p className="text-[#FCA627]  text-[14px] font-bold">
            Primary School Tuition
          </p>
          <h2 className="text-3xl font-semibold">
            Primary School Tuition Rates
          </h2>
          <p className="text-gray-600">
            Primary school tuition in Sri Lanka typically costs LKR 500-1500 per
            hour for 1.5-2 hour sessions. Lower Primary tuition focuses on
            building foundational skills in subjects like Sinhala/Tamil,
            English, and Math. For Upper Primary, especially leading up to the
            Grade 5 Scholarship Examination, lessons become more exam-focused
            with timed practices and strategy, often increasing in frequency for
            a final push towards better results.
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

export default PrimaryLevelTuitionRates;
