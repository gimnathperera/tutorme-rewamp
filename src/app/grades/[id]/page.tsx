"use client";

import { useFetchGradeByIdQuery } from "@/store/api/splits/grades";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Subjects: FC = () => {
  const params = useParams();
  const gradeId = params?.id as string;

  const { data: gradeData, error, isLoading } = useFetchGradeByIdQuery(gradeId);

  if (isLoading || gradeData === undefined) {
    return (
      <div className="flex justify-center bg-neutral-950 py-24">
        <div className="w-full max-w-7xl space-y-6">
          <div className="text-center space-y-4">
            <Skeleton height={40} width="60%" className="mx-auto" />
            <Skeleton height={20} width="80%" className="mx-auto" />
            <Skeleton height={20} width="70%" className="mx-auto" />
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="block p-4 shadow-md bg-white rounded-lg hover:shadow-lg transition-shadow mx-auto max-w-5xl"
              >
                <div className="flex justify-between items-center">
                  <div className="w-full space-y-2">
                    <Skeleton height={24} width="50%" />
                    <Skeleton height={16} width="80%" />
                  </div>
                  <Skeleton circle height={24} width={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <p>Failed to load grade details. Please try again later.</p>
      </div>
    );
  }

  const { title, subjects = [] } = gradeData;

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl py-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {title || "Pick a Subject and Dive In!"}
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
          Discover fun and engaging lessons tailored to your interests.
          <br className="hidden sm:block" />
          Choose a subject to start your exciting learning journey!
        </h3>
      </div>
      <div className="bg-neutral-950 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          {subjects.length > 0 ? (
            subjects.map(({ id, title, description }) => (
              <Link
                key={id}
                href={`/grades/${gradeId}/subject/${id}`}
                className="block p-4 shadow-md bg-white rounded-lg hover:shadow-lg transition-shadow m-10"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <p className="text-gray-600">{description}</p>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400">
              No subjects available for this grade.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
