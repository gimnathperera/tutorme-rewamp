import { bodyDetails } from "@/lib/data/levels-and-exams/body-details";
import React from "react";
import { CheckCircleIcon } from "lucide-react";
import WhatToExceptFromTutorMe from "@/components/shared/what-to-expect/page";
import Image from "next/image";
import ClassRoomImage from "../../../../public/images/level-and-exams/image.png";
import PrimaryLevelTuitionRates from "@/app/tuition-rates/components/primary-level-rates";
import GradeSixToNineRates from "@/app/tuition-rates/components/grade-six-to-ten-rates";
import OrdinaryLevelRates from "@/app/tuition-rates/components/odinary-level-rates";
import AdvancedLevelRates from "@/app/tuition-rates/components/advanced-level-rates";
import { Card, CardHeader } from "@/components/ui/card";
import TutorImage from "../../../../public/images/level-and-exams/tutor.png";
import Link from "next/link";

interface ProductPageProps {
  params: { id: string };
}

const LevelAndExams = async ({ params }: ProductPageProps) => {
  const details = bodyDetails.find((d) => d.id === params.id);
  if (!details) {
    return <div className="p-8 text-xl">Level not found</div>;
  }
  return (
    <div>
      <div className="mx-auto max-w-7xl py-10">
        <div className="bg-gray-100 p-10 border rounded-xl">
          <h1 className="text-4xl font-bold  mb-4 text-center">
            Looking for The Best {details.name} Tutors in Sri Lanka?
          </h1>
          <div className="flex gap-5 items-center justify-center  flex-row">
            <div>
              <Image src={TutorImage} alt={"Tutor Image"} width={400} />
            </div>
            <section className="mb-8 flex justify-between items-center">
              <ul className="list-inside space-y-1">
                {details.specialDetails.map((item, index) => (
                  <li key={index} className="flex flex-row gap-2">
                    <CheckCircleIcon className="text-sm text-[#FCA627]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
        <section className="py-10">
          <WhatToExceptFromTutorMe name={details.name} />
        </section>
        <section>
          {(() => {
            switch (details.name) {
              case "Primary Level":
                return <PrimaryLevelTuitionRates />;
              case "Grades 6 to 9 (Junior Secondary Level)":
                return <GradeSixToNineRates />;
              case "GCE Ordinary Level (O-Level)":
                return <OrdinaryLevelRates />;
              case "GCE Advanced Level (A-Level)":
                return <AdvancedLevelRates />;
              default:
                return null;
            }
          })()}
        </section>
        <section className="border rounded-2xl p-10 bg-gray-100">
          <div className="flex gap-10 flex-row ">
            <div className="space-y-4">
              <p className="text-3xl font-semibold text-[#28BBA3]">
                What Are The Challenges Faced By {details.name} Students in
                Singapore?
              </p>
              <Image
                src={ClassRoomImage}
                alt="Classroom Image"
                className="rounded-2xl"
              />
            </div>
            <div className="">
              <h2 className="text-xl text-left font-semibold mb-2">
                Key Challenges:
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-800">
                {details.keyChallenges.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="my-10 space-y-4 ">
          <div className="space-y-4">
            <h1 className="text-center text-[#FCA627] font-bold text-xl">
              Effective a level Home Tuition
            </h1>
            <h1 className="text-3xl font-semibold text-center">
              What Are The Topics and Subjects Covered By Tutor Me{" "}
              {details.name}
              Tutors?
            </h1>
          </div>
          <div className="mt-5">
            {details.subjects.map((sub, index) => (
              <Card className="flex justify-between flex-row" key={index}>
                <CardHeader className="">{sub}</CardHeader>
                <Link
                  className="px-10 rounded-xl flex justify-center items-center text-white font-semibold bg-[#28BBA3]"
                  href={`/grades/${sub}`}
                >
                  <button className="">View Subject</button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LevelAndExams;
