import Link from "next/link";
import React, { FC } from "react";
import { ChevronRight } from "lucide-react";

type Subject = {
  subjectId: number;
  attributes: {
    heading: string;
    subheading: string;
  };
};

const grades: any[] = [
  { id: 1, attributes: { title: "Grade 1" } },
  { id: 2, attributes: { title: "Grade 2" } },
  { id: 3, attributes: { title: "Grade 3" } },
  { id: 4, attributes: { title: "Grade 4" } },
  { id: 5, attributes: { title: "Grade 5" } },
  { id: 6, attributes: { title: "Grade 6" } },
  { id: 7, attributes: { title: "Ordinary Level" } },
  { id: 8, attributes: { title: "Advanced Level" } },
];

const subjectDetails: Subject[] = [
  {
    subjectId: 1,
    attributes: {
      heading: "Sinhala",
      subheading: "Details learning Sinhala",
    },
  },
  {
    subjectId: 2,
    attributes: {
      heading: "Mathematics",
      subheading: "Details learning Mathematics",
    },
  },
  {
    subjectId: 3,
    attributes: {
      heading: "English",
      subheading: "Details learning English",
    },
  },
];

const Subjects: FC = () => {
  const selectedGrade = grades[0];

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl py-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Pick a Subject and Dive In!
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
          Discover fun and engaging lessons tailored to your interests.
          <br className="hidden sm:block" />
          Choose a subject to start your exciting learning journey!
        </h3>
      </div>
      <div className="bg-neutral-950 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          {subjectDetails.map(({ subjectId, attributes }) => (
            <Link
              key={subjectId}
              href={`/grades/${selectedGrade.id}/subject/${subjectId}`}
              className="block p-4 shadow-md bg-white rounded-lg hover:shadow-lg transition-shadow m-10"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    {attributes.heading}
                  </h2>
                  <p className="text-gray-600">{attributes.subheading}</p>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
