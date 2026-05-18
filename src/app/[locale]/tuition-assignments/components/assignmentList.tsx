"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useFetchTuitionAssignmentsQuery } from "@/store/api/splits/tuition-assignments";
import { TuitionAssignment } from "@/types/response-types";
import { FetchTuitionAssignments } from "@/types/request-types";

interface AssignmentListProps {
  gradeId: string;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ gradeId }) => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const limit = 10;

  const queryParams: FetchTuitionAssignments = {
    page,
    limit,
  };

  const { data, isLoading } = useFetchTuitionAssignmentsQuery(queryParams);

  const assignments = useMemo(() => {
    const allAssignments: TuitionAssignment[] = data?.results ?? [];

    if (!gradeId || gradeId === "all") return allAssignments;

    return allAssignments.filter((assignment: any) => {
      const gradeField = assignment.gradeId;

      if (!gradeField) return false;

      if (typeof gradeField === "string") return gradeField === gradeId;

      if (typeof gradeField === "object") {
        if (gradeField.id && typeof gradeField.id === "string") {
          return gradeField.id === gradeId;
        }
        if (gradeField._id && typeof gradeField._id === "string") {
          return gradeField._id === gradeId;
        }
      }

      return false;
    });
  }, [data, gradeId]);

  const totalCount = assignments.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const handleApply = () => {
    const selectedAssignments = assignments.filter((assignment) =>
      selected.includes(assignment.id),
    );
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "selectedAssignments",
        JSON.stringify(selectedAssignments),
      );
    }
    router.push("/tuition-assignments/selected");
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full overflow-x-auto max-w-5xl border border-gray-300 rounded-xl">
        <Table className="min-w-[600px] bg-white rounded-xl">
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  Loading assignments...
                </TableCell>
              </TableRow>
            ) : assignments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  No assignments found.
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment: any) => (
                <TableRow
                  key={assignment.id}
                  className={
                    selected.includes(assignment.id) ? "bg-blue-50" : ""
                  }
                >
                  <TableCell className="p-4 font-semibold text-base">
                    <input
                      className="mr-3 border rounded border-gray-400"
                      type="checkbox"
                      checked={selected.includes(assignment.id)}
                      onChange={() => handleSelect(assignment.id)}
                    />
                    {[
                      assignment.assignmentNumber,
                      assignment.title,
                      assignment.gradeName ||
                        assignment.gradeTitle ||
                        assignment.gradeId?.title,
                      assignment.address,
                      assignment.assignmentPrice,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center font-medium text-base py-3"
              >
                <span>{selected.length} Assignments Selected</span>
                <button
                  className="ml-4 px-4 py-2 bg-primary-700 text-white rounded-full font-semibold disabled:opacity-50"
                  disabled={selected.length === 0}
                  onClick={handleApply}
                >
                  Apply
                </button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={handlePrevPage}
                  >
                    Previous
                  </Button>
                  <span className="font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={handleNextPage}
                  >
                    Next
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default AssignmentList;
