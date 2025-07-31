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
import { gradeOneToFiveRates } from "@/lib/data/tuition-rates/one-to-five";
import { aboutDetails } from "@/lib/data/tuition-rates/about-details";

const PrimaryLevelTuitionRates = () => {
  const about = aboutDetails;

  const primaryLevelInfo = about.find(
    (detail) => detail.name === "Primary Level Tuition"
  );

  if (!primaryLevelInfo) {
    return <div>Error: Primary Level details not found.</div>;
  }
  const data = gradeOneToFiveRates;
  return (
    <div>
      <div className="space-y-4 m-10">
        <div className="flex space-y-4 justify-center items-center flex-col mb-10">
          <p className="text-[#FCA627] text-[18px] font-bold">
            {primaryLevelInfo.subTitle}
          </p>
          <h2 className="text-3xl font-semibold">{primaryLevelInfo.title}</h2>
          <p className="text-gray-600">{primaryLevelInfo.description}</p>
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
