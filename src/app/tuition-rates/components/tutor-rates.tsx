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
import { tuitionRates } from "@/lib/data/tuition-rates/tuition-rates";
import { aboutDetails } from "@/lib/data/tuition-rates/about-details";

const TutorRatesSection = () => {
  const data = tuitionRates;
  const about = aboutDetails;

  const allLevelInfo = about.find(
    (detail) => detail.name === "All Tuition Rates"
  );

  if (!allLevelInfo) {
    return <div>Error: All Tuition Rates details not found.</div>;
  }

  return (
    <div>
      <div className="space-y-4 m-10">
        <div className="flex justify-center items-center flex-col mb-10">
          <p className="text-[#FCA627] text-[18px] font-bold">
            {allLevelInfo.subTitle}
          </p>
          <h2 className="text-3xl font-semibold">{allLevelInfo.title}</h2>
          <p className="text-gray-600">{allLevelInfo.description}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="text-center align-middle"></TableHead>
              <TableHead>
                <div className="flex justify-center items-center">
                  <Image
                    src={PartTimeImage}
                    alt="part-time-teacher-image"
                    width={100}
                    height={100}
                  />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex justify-center items-center">
                  <Image
                    src={FullTimeImage}
                    alt="part-time-teacher-image"
                    width={100}
                    height={100}
                  />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex justify-center items-center">
                  <Image
                    src={GovTeacherImage}
                    alt="part-time-teacher-image"
                    width={100}
                    height={100}
                  />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

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

export default TutorRatesSection;
