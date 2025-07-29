import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import PartTimeImage from "../../../../public/images/tuitionRates/part-time-2.png";
import FullTimeImage from "../../../../public/images/tuitionRates/full-time-2.png";
import GovTeacherImage from "../../../../public/images/tuitionRates/ex-teacher-2.png";
import { tutorDetails } from "@/lib/data/tuition-rates/tutor-details";

const TutorDetailsSection = () => {
  const details = tutorDetails;
  return (
    <div>
      <div className="m-10">
        <div className="flex space-y-4 justify-center items-center flex-col mb-10">
          <p className="text-[#FCA627]  text-[14px] font-bold">
            Tutor Categories
          </p>
          <h2 className="text-3xl font-semibold">Types of Home Tutors</h2>
          <p className="text-gray-600">
            In this section, we help you to understand the 3 main categories of
            Home Tutors in Sri Lanka. This information will assist you greatly
            in making the right tutor choice for your needs.
          </p>
        </div>
        <Table className="mt-10">
          <TableHeader>
            <TableHead>
              <div className="flex justify-center items-center">
                <Image
                  src={PartTimeImage}
                  alt="part-time-teacher-image"
                  width={150}
                  height={150}
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex justify-center items-center">
                <Image
                  src={FullTimeImage}
                  alt="part-time-teacher-image"
                  width={150}
                  height={150}
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex justify-center items-center">
                <Image
                  src={GovTeacherImage}
                  alt="part-time-teacher-image"
                  width={150}
                  height={150}
                />
              </div>
            </TableHead>
          </TableHeader>
          <TableHeader className="text-white  text-lg font-semibold">
            <TableHead className="text-center bg-[#28BBA3] align-middle">
              Part-Time Tutors
            </TableHead>
            <TableHead className="text-center bg-[#EF4350] align-middle">
              Full-Time Tutors
            </TableHead>
            <TableHead className="text-center bg-[#FCA627] align-middle">
              Ex / Current MOE Teachers
            </TableHead>
          </TableHeader>
          <TableBody className="bg-gray-100 text-md">
            {details.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="text-center align-middle">
                  {data.partTimeTutorDetail}
                </TableCell>
                <TableCell className="text-center align-middle">
                  {data.fullTimeTutorDetail}
                </TableCell>
                <TableCell className="text-center align-middle">
                  {data.moeTutorDetail}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TutorDetailsSection;
