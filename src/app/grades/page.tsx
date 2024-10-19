"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type Grade = {
  id: number;
  title: string;
  description: string;
};

const grades: Grade[] = [
  {
    id: 1,
    title: "Grade 1",
    description: "Start your learning journey",
  },
  {
    id: 2,
    title: "Grade 2",
    description: "Build on your foundations",
  },
  {
    id: 3,
    title: "Grade 3",
    description: "Expand your knowledge",
  },
  {
    id: 4,
    title: "Grade 4",
    description: "Dive deeper into subjects",
  },
  {
    id: 5,
    title: "Grade 5",
    description: "Prepare for middle school",
  },
  {
    id: 6,
    title: "Grade 6",
    description: "Transition to advanced topics",
  },
  {
    id: 7,
    title: "Ordinary Level",
    description: "Comprehensive study program",
  },
  {
    id: 8,
    title: "Advanced Level",
    description: "Specialized academic courses",
  },
];

const GradesPage: FC = () => {
  const router = useRouter();

  const onHandleGradeClick = (id: number) => {
    router.push(`/grades/${id}`);
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl py-4 m-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Pick Your Grade and Let&apos;s Get Learning!
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
          Explore courses and resources just for you! Pick your grade to begin
          <br className="hidden sm:block" />
          an exciting and personalized learning adventure!
        </h3>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-16 lg:px-10 rounded-3xl bg-lightgrey grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {grades.map(({ id, title, description }) => (
          <Card key={id} className="flex flex-col m-2 bg-white">
            <CardContent className="flex-grow p-6">
              <div className="w-16 h-16 mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full text-primary"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                  <path d="M6 12h4" />
                  <path d="M6 16h4" />
                  <path d="M14 12h2" />
                  <path d="M14 16h2" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">
                {title}
              </h2>
              <p className="text-center text-muted-foreground">{description}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <button
                className="py-3 px-5 text-sm disabled:opacity-50 font-medium w-full text-center text-white rounded-lg bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={() => onHandleGradeClick(id)}
              >
                Start Learning
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GradesPage;
