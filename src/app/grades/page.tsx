"use client";

import Card from "@/src/components/shared/card";
import Image from "next/image";
import { FC } from "react";
import { useRouter } from "next/navigation";

type Grade = {
  id: number;
  attributes: {
    title: string;
  };
};

const grades: Grade[] = [
  { id: 1, attributes: { title: "Grade 1" } },
  { id: 2, attributes: { title: "Grade 2" } },
  { id: 3, attributes: { title: "Grade 3" } },
  { id: 4, attributes: { title: "Grade 4" } },
  { id: 5, attributes: { title: "Grade 5" } },
  { id: 6, attributes: { title: "Grade 6" } }, // Fixed title here
  { id: 7, attributes: { title: "Ordinary Level" } },
  { id: 8, attributes: { title: "Advanced Level" } },
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
        {grades.map(({ id, attributes }) => (
          <Card
            key={id}
            content={
              <>
                <Image
                  src="/images/grades/image.png"
                  alt="Grade image"
                  width={200}
                  height={200}
                />
                <button
                  className="mt-4 text-xl font-semibold text-white bg-btnblue py-2 px-6 hover:bg-hoblue rounded-full"
                  onClick={() => onHandleGradeClick(id)}
                >
                  {attributes.title}
                </button>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default GradesPage;
