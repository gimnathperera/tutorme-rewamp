'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useFetchTuitionAssignmentsQuery } from '@/store/api/splits/tuition-assignments';

interface AssignmentListProps {
  tutorType: string;
  gradeId: string;
  gender: string;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ tutorType, gradeId, gender }) => {
  const router = useRouter();

  // ✅ Pagination states
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryParams: any = { page, limit };
  if (gradeId && gradeId !== 'all') queryParams.gradeId = gradeId;

  const { data, isLoading } = useFetchTuitionAssignmentsQuery(queryParams);
  const allAssignments = data?.results || [];
  const totalCount = data?.totalResults || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const assignments = useMemo(() => {
    let filtered = allAssignments;

    if (tutorType && tutorType !== 'all') {
      filtered = filtered.filter((assignment) => {
        const assignmentTutorType = (assignment as any).tutorType;
        return assignmentTutorType?.toLowerCase() === tutorType.toLowerCase();
      });
    }

    if (gender && gender !== 'all') {
      filtered = filtered.filter((assignment) => {
        const assignmentGender = (assignment as any).gender || (assignment as any).tutor?.gender;
        return assignmentGender?.toLowerCase() === gender.toLowerCase();
      });
    }

    return filtered;
  }, [allAssignments, tutorType, gender]);

  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    const selectedAssignments = assignments.filter((assignment) =>
      selected.includes(assignment.id)
    );
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        'selectedAssignments',
        JSON.stringify(selectedAssignments)
      );
    }
    router.push('/tuition-assignments/selected');
  };

  // ✅ Pagination controls
  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className='flex flex-col items-center w-full'>
      <div className="w-full overflow-x-auto max-w-5xl border border-gray-300 rounded-xl">
        <Table className="min-w-[600px] bg-white rounded-xl">
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  Loading assignments...
                </TableCell>
              </TableRow>
            ) : assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  No assignments found.
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow
                  key={assignment.id}
                  className={selected.includes(assignment.id) ? 'bg-blue-50' : ''}
                >
                  <TableCell className='p-4 font-semibold text-base'>
                    <input
                      className='mr-3 border rounded border-gray-400'
                      type="checkbox"
                      checked={selected.includes(assignment.id)}
                      onChange={() => handleSelect(assignment.id)}
                    />
                    {[
                      assignment.assignmentNumber,
                      assignment.title,
                      assignment.gradeName,
                      assignment.tutorType,
                      assignment.address,
                      assignment.assignmentPrice
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={8} className="text-center font-medium text-base py-3">
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

            {/* ✅ Pagination Controls */}
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
                    Page {page} of {totalPages || 1}
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
