import Image from "next/image";
import React from "react";
import IconOne from "../../../../public/images/what-to-except/expect-icon-1.png";
import IconTwo from "../../../../public/images/what-to-except/expect-icon-2.png";
import IconThree from "../../../../public/images/what-to-except/expect-icon-3.png";
import IconFour from "../../../../public/images/what-to-except/expect-icon-4.png";
import IconFive from "../../../../public/images/what-to-except/expect-icon-5.png";
import IconSix from "../../../../public/images/what-to-except/expect-icon-6.png";
import IconSeven from "../../../../public/images/what-to-except/expect-icon-7.png";
import IconEight from "../../../../public/images/what-to-except/expect-icon-8.png";
import IconNine from "../../../../public/images/what-to-except/expect-icon-9.png";

const WhatToExceptFromTutorMe = (props: { name: string }) => {
  const cards = [
    {
      icon: IconOne,
      text: `1 to 1 ${props.name} Working On Fixing Gaps In Students’ Learning`,
    },
    {
      icon: IconTwo,
      text: `Expert Guidance In ${props.name} Subjects and Learning Approaches`,
    },
    {
      icon: IconThree,
      text: `Clear Explanations Of Concepts For ${props.name} Subjects`,
    },
    {
      icon: IconFour,
      text: `Additional Learning Notes And Practices From Competent ${props.name} Tutors`,
    },
    {
      icon: IconFive,
      text: `Fully Prepare For School Examinations And National Examinations`,
    },
    {
      icon: IconSix,
      text: `Clear Doubts And Frustration From Difficult School Homework`,
    },
    {
      icon: IconSeven,
      text: `Gain Interest In “Boring” Subjects Through Tutors’ Engaging Lessons`,
    },
    {
      icon: IconEight,
      text: `Observe A Positive Transformation To Your Secondary School Results`,
    },
    {
      icon: IconNine,
      text: `Choose Your Desired Tutor From Our Pool of 8,000+ Top Secondary School Tutors`,
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-center text-[#FCA627] font-bold text-xl">
          {props.name} Tuition Singapore
        </h1>
        <h1 className="text-3xl font-semibold text-center">
          What To Expect From MindFlex’s {props.name} Tutors
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition"
          >
            <Image src={card.icon} alt="" width={50} height={50} />
            <p className="mt-4 text-sm font-medium text-gray-700">
              {card.text}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default WhatToExceptFromTutorMe;
//llm engine
//rag framework - langchain
//vector database
//audio speak ethazise - azure speak enthazis
