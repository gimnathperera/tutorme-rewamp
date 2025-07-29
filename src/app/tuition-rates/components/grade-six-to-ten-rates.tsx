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
import { gradeSixToNineRates } from "@/lib/data/tuition-rates/six-to-nine";

const GradeSixToNineRates = () => {
  const data = gradeSixToNineRates;
  return (
    <div>
      <div className="space-y-4 m-10">
        <div className="flex space-y-4 justify-center items-center flex-col mb-10">
          <p className="text-[#FCA627]  text-[14px] font-bold">
            Grade Six to Nine School Tuition Rates
          </p>
          <h2 className="text-3xl font-semibold">
            Grade Six to Nine Tuition Rates
          </h2>
          <p className="text-gray-600">
            For Grades 6-9 in Sri Lanka, tuition costs generally range from LKR
            700-2000 per hour for 1.5-2 hour sessions. In Lower Secondary
            (Grades 6-8), tuition helps students transition and build
            foundations in new subjects. As they move to Upper Secondary (Grade
            9 onwards, towards the G.C.E. Ordinary Level Examination), the focus
            shifts to intensive exam preparation, including past papers and
            techniques, with increased frequency closer to the O/L exams.
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

export default GradeSixToNineRates;
