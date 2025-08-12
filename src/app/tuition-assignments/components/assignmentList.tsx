'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { useFetchTuitionAssignmentsQuery } from '@/store/api/splits/tuition-assignments';

interface AssignmentListProps {
  tutorType: string;
  gradeId: string;
  gender: string;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ tutorType, gradeId, gender }) => {
    const router = useRouter();
    const queryParams: any = {};
    if (gradeId) queryParams.gradeId = gradeId;

    const { data, isLoading } = useFetchTuitionAssignmentsQuery(queryParams);
    const assignments = data?.results || [];
    const [selected, setSelected] = useState<string[]>([]);

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const handleApply = () => {
        const selectedAssignments = assignments.filter(a => selected.includes(a._id));
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('selectedAssignments', JSON.stringify(selectedAssignments));
        }
        router.push('/tuition-assignments/selected');
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
                            assignments.map((a) => (
                                <TableRow key={a._id} className={selected.includes(a._id) ? 'bg-blue-50' : ''}>
                                    <TableCell>
                                        <input
                                            className='mr-2 border rounded border-gray-400'
                                            type="checkbox"
                                            checked={selected.includes(a._id)}
                                            onChange={() => handleSelect(a._id)}
                                        />
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
                    </TableFooter>
                </Table>
            </div>
            <TableCaption className="text-center mt-2">A list of available tuition assignments.</TableCaption>
        </div>
    );
};

export default AssignmentList;