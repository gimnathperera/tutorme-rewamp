import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { advancedLevelRates } from "@/lib/data/tuition-rates/advanced-level";
import { aboutDetails } from "@/lib/data/tuition-rates/about-details";

const AdvancedLevelRates = () => {
  const data = advancedLevelRates;
  const about = aboutDetails;

  const advancedLevelInfo = about.find(
    (detail) => detail.name === "Advanced Level Tuition",
  );

  if (!advancedLevelInfo) {
    return <div>Error: Advanced Level details not found.</div>;
  }

  return (
    <div>
      <div className="space-y-4 m-10">
        <div className="flex space-y-4 justify-center items-center flex-col mb-10">
          <p className="text-[#FCA627]  text-[18px] font-bold">
            {advancedLevelInfo.subTitle}
          </p>
          <h2 className="text-3xl font-semibold">{advancedLevelInfo.title}</h2>
          <p className="text-gray-600">{advancedLevelInfo.description}</p>
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
