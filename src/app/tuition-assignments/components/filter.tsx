"use client";

import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { SelectButton } from "@/components/shared/select";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import AssignmentList from "./assignmentList";

const Filter = () => {
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  const [appliedGradeId, setAppliedGradeId] = useState<string>("");

  const { data: gradesData, isLoading: isGradesLoading } = useFetchGradesQuery({
    page: 1,
    limit: 100,
  });

  const gradeOptions = [
    { label: "All Grades", value: "all" },
    ...(gradesData?.results.map((grade) => ({
      label: grade.title, // show name
      value: grade.id, // use id for filtering
    })) || []),
  ];

  const handleApply = () => {
    setAppliedGradeId(selectedGradeId);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 mb-6 w-full max-w-3xl px-4 py-4 rounded-lg">
        {isGradesLoading ? (
          <Skeleton height={50} width={200} borderRadius={10} />
        ) : (
          <SelectButton
            placeholder="Grade"
            selectLabel="Grade"
            selectItems={gradeOptions}
            onChange={setSelectedGradeId}
          />
        )}
      </div>

      <div className="flex justify-center w-full mb-6">
        <button
          className="text-sm md:text-xl font-semibold hover:shadow-xl bg-primary-700 text-white py-2 px-8 rounded-full hover:opacity-90 transition-all"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>

      <AssignmentList gradeId={appliedGradeId} />
    </div>
  );
};

export default Filter;
