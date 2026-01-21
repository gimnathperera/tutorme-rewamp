"use client";

import React, { FC } from "react";
import { CheckCircleIcon } from "lucide-react";
import WhatToExceptFromTutorMe from "@/components/shared/what-to-expect/page";
import Image from "next/image";
import ClassRoomImage from "../../../../public/images/level-and-exams/image.png";
import { Card, CardHeader } from "@/components/ui/card";
import TutorImage from "../../../../public/images/level-and-exams/tutor.png";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetchLevelsByIdQuery } from "@/store/api/splits/levels";
import TuitionRatesByLevelComponent from "@/components/shared/tuition-rates";

const LevelAndExams: FC = () => {
  const params = useParams();
  const levelId = params?.id as string;

  const {
    data: level,
    error,
    isLoading,
  } = useFetchLevelsByIdQuery({ levelId });

  if (isLoading) {
    return <div className="p-8 text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-xl text-red-500">Error loading data</div>;
  }

  if (!level) {
    return <div className="p-8 text-xl">Level not found</div>;
  }

  return (
    <div className="mx-auto max-w-7xl py-10">
      {/* Header */}
      <div className="bg-gray-100 p-10 border rounded-xl">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Looking for The Best {level.title} Tutors in Sri Lanka?
        </h1>
        <div className="flex gap-5 items-center justify-center flex-row">
          <Image src={TutorImage} alt="Tutor" width={400} />
          <section className="mb-8 flex justify-between items-center">
            <ul className="list-inside space-y-1">
              {level?.details?.map((detail, index) => (
                <li key={index} className="flex flex-row gap-2">
                  <CheckCircleIcon className="text-sm text-[#FCA627]" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* What to Expect */}
      <section className="py-10">
        <WhatToExceptFromTutorMe name={level.title} />
      </section>

      {/* Tuition Rates */}
      <TuitionRatesByLevelComponent levelTitle={level.title} />

      {/* Challenges */}
      <section className="border rounded-2xl p-10 bg-gray-100 mt-10">
        <div className="flex gap-10 flex-row">
          <div className="space-y-4">
            <p className="text-3xl font-semibold text-[#28BBA3]">
              What Are The Challenges Faced By {level.title} Students in Sri
              Lanka?
            </p>
            <Image
              src={ClassRoomImage}
              alt="Classroom"
              className="rounded-2xl"
            />
          </div>
          <div>
            <h2 className="text-xl text-left font-semibold mb-2">
              Key Challenges:
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              {(level.challanges || level.challanges)?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="my-10 space-y-4">
        <div className="space-y-4">
          <h1 className="text-center text-[#FCA627] font-bold text-xl">
            Effective {level.title} Home Tuition
          </h1>
          <h1 className="text-3xl font-semibold text-center">
            What Are The Topics and Subjects Covered By Tuition Lanka
            {level.title} Tutors?
          </h1>
        </div>
        <div className="mt-5">
          {level.subjects.map((sub, index) => (
            <Card className="flex justify-between flex-row" key={index}>
              <CardHeader>{sub?.title}</CardHeader>
              <Link
                className="flex justify-center items-center"
                href={`/subjects/${sub?.id}`}
              >
                <button className="m-5 p-2 rounded-xl text-white font-semibold bg-[#28BBA3]">
                  View Subject
                </button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LevelAndExams;
