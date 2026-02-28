import React from "react";
import Image from "next/image";
import PartTimeImage from "../../../../public/images/tuitionRates/part-time-2.png";
import FullTimeImage from "../../../../public/images/tuitionRates/full-time-2.png";
import GovTeacherImage from "../../../../public/images/tuitionRates/ex-teacher-2.png";
import { tutorDetails } from "@/lib/data/tuition-rates/tutor-details";

const CATEGORIES = [
  {
    key: "partTimeTutorDetail" as const,
    label: "Part-Time Tutors",
    color: "#28BBA3",
    gradient: "from-[#28BBA3] to-[#22a896]",
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    badgeBg: "bg-[#28BBA3]",
    image: PartTimeImage,
  },
  {
    key: "fullTimeTutorDetail" as const,
    label: "Full-Time Tutors",
    color: "#EF4350",
    gradient: "from-[#EF4350] to-[#e33a46]",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    badgeBg: "bg-[#EF4350]",
    image: FullTimeImage,
  },
  {
    key: "moeTutorDetail" as const,
    label: "Ex / Current MOE Teachers",
    color: "#FCA627",
    gradient: "from-[#FCA627] to-[#f5b944]",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badgeBg: "bg-[#FCA627]",
    image: GovTeacherImage,
  },
];

const TutorDetailsSection = () => {
  const details = tutorDetails;

  return (
    <section className="py-4 px-2 sm:px-0">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10">
        <span className="text-[#FCA627] text-sm font-bold uppercase tracking-widest">
          Tutor Categories
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Types of Home Tutors
        </h2>
        <p className="text-gray-500 max-w-2xl text-[15px] leading-relaxed">
          In this section, we help you understand the 3 main categories of Home
          Tutors in Sri Lanka. This information will assist you greatly in
          making the right tutor choice for your needs.
        </p>
        {/* Decorative underline */}
        <div className="flex gap-1 mt-1">
          <span className="w-8 h-1 rounded-full bg-[#28BBA3]" />
          <span className="w-4 h-1 rounded-full bg-[#FCA627]" />
          <span className="w-2 h-1 rounded-full bg-[#EF4350]" />
        </div>
      </div>

      {/* Responsive Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            className="flex flex-col rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white hover:shadow-lg transition-shadow duration-300"
          >
            {/* Card Header */}
            <div
              className={`bg-gradient-to-br ${cat.gradient} flex flex-col items-center justify-center gap-3 pt-8 pb-6 px-4`}
            >
              <div className="bg-white/20 rounded-full p-2">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-white text-base font-bold text-center leading-snug">
                {cat.label}
              </span>
            </div>

            {/* Detail Rows */}
            <div className="flex flex-col divide-y divide-gray-100 flex-1">
              {details.map((data, idx) => (
                <div
                  key={data.id}
                  className={`px-5 py-3.5 text-sm text-gray-700 leading-relaxed transition-colors duration-150 hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <span className="flex items-start gap-2">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {data[cat.key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll Hint (only on very small screens) */}
      <p className="text-xs text-gray-400 text-center mt-4 md:hidden">
        Scroll horizontally to compare categories
      </p>
    </section>
  );
};

export default TutorDetailsSection;
