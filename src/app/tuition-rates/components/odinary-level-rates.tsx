import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { ordinaryLevelRates } from "@/lib/data/tuition-rates/ol-subjects";
import { aboutDetails } from "@/lib/data/tuition-rates/about-details";

const OrdinaryLevelRates = () => {
  const data = ordinaryLevelRates;
  const about = aboutDetails;

  const ordinaryLevelInfo = about.find(
    (detail) => detail.name === "Ordinary Level Tuition"
  );

  if (!ordinaryLevelInfo) {
    return <div>Error: Ordinary Level details not found.</div>;
  }
  return (
    <div>
      <div className="space-y-4 m-10">
        <div className="flex justify-center space-y-4 items-center flex-col mb-10">
          <p className="text-[#FCA627] text-[18px] font-bold">
            {ordinaryLevelInfo.subTitle}
          </p>
          <h2 className="text-3xl font-semibold">{ordinaryLevelInfo.title}</h2>
          <p className="text-gray-600">{ordinaryLevelInfo.description}</p>
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

export default OrdinaryLevelRates;
