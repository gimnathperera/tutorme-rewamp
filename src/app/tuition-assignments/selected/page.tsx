"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import type { TuitionAssignment } from '@/types/response-types';

const SelectedAssignmentsPage: React.FC = () => {
  const [selectedAssignments, setSelectedAssignments] = useState<TuitionAssignment[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('selectedAssignments');
      if (data) {
        setSelectedAssignments(JSON.parse(data));
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-8 md:px-16 lg:px-32 py-10 rounded-2xl">
      <p className="font-extrabold text-3xl sm:text-4xl py-6 text-center">Selected Assignments</p>
      <div className='flex flex-col items-center'>
        <div className="w-full overflow-x-auto max-w-5xl border border-gray-300 rounded-xl">
          <Table className="min-w-[600px] bg-white rounded-xl">
            <TableBody>
              {selectedAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No assignments selected.
                  </TableCell>
                </TableRow>
              ) : (
                selectedAssignments.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell className="font-semibold text-lg">
                      {[
                        a.assignmentNumber,
                        a.title,
                        a.gradeName,
                        a.tutorType,
                        a.address,
                        a.assignmentPrice
                      ].filter(Boolean).join(', ')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>{selectedAssignments.length} Assignments Selected</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <TableCaption className="text-center mt-2">A list of your selected tuition assignments.</TableCaption>
      </div>
      <button
        className="mt-8 px-4 py-2 bg-primary-700 text-white rounded-full font-semibold"
        onClick={() => router.push('/tuition-assignments')}
      >
        Back to Assignments
      </button>
    </div>
  );
};

export default SelectedAssignmentsPage;
