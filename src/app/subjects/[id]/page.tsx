"use client";

import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { useParams } from "next/navigation";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Subject } from "@/types/response-types";

const Subjects: FC = () => {
  const params = useParams();
  const subjectId = params?.id as string;

  const { data: subjectData, error, isLoading } = useFetchSubjectsQuery({ subjectId });

  if (isLoading || subjectData === undefined) {
    return (
      <div className="flex justify-center bg-neutral-950 py-24">
        <div className="w-full max-w-7xl space-y-6">
          <div className="text-center space-y-4">
            <Skeleton height={40} width="60%" className="mx-auto" />
            <Skeleton height={20} width="80%" className="mx-auto" />
            <Skeleton height={20} width="70%" className="mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <p className="text-center text-red-500 font-medium">
          Failed to load subject details. Please try again later.
        </p>
      </div>
    );
  }

  const subject = (subjectData?.results && subjectData.results[0]) as Subject;

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl py-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {subject.title || "Pick a Subject and Dive In!"}
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
          {subject.description ||
            "Discover fun and engaging lessons tailored to your interests."}
          <br className="hidden sm:block" />
        </h3>
      </div>
    </div>
  );
};

export default Subjects;
