"use client";

import { SelectButton } from "@/components/shared/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState, useMemo } from "react";
import assignmentList from "@/lib/data/tuition-assignments/assignment-list";
import tutorTypes from "@/lib/data/tuition-assignments/tutor-types";
import levels from "@/lib/data/tuition-assignments/levels";
import genders from "@/lib/data/tuition-assignments/genders";

const tutorTypeOptions = tutorTypes;
const levelOptions = levels;
const genderOptions = genders;

type Assignment = {
  id: string;
  subject: string;
  level: string;
  tutorType: string;
  gender: string;
  location: string;
  rate: string;
};

const TuitionAssignments = () => {
  const [tutorType, setTutorType] = useState("");
  const [level, setLevel] = useState("");
  const [gender, setGender] = useState("");
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);

  // Sample tuition assignments data
  const assignments = useMemo<Assignment[]>(
    () => assignmentList,
    []
  );

  const handleApply = () => {
    // Filter assignments based on selected filters
    let filtered = assignments;
    if (tutorType) filtered = filtered.filter(a => a.tutorType === tutorType);
    if (level) filtered = filtered.filter(a => a.level === level);
    if (gender) filtered = filtered.filter(a => a.gender === gender || a.gender === "any" || gender === "any");
    setFilteredAssignments(filtered);
  };

  // Show all assignments by default
  React.useEffect(() => {
    setFilteredAssignments(assignments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 mx-32 my-10 py-10 rounded-xl border">
        <p className="font-extrabold text-[40px] py-8">Find A Tutor</p>
        <div className="flex flex-row gap-8 mb-6">
            <SelectButton placeholder="Tutor Type" selectLabel="Tutor Type" selectItems={tutorTypeOptions} onChange={setTutorType} />
            <SelectButton placeholder="Level" selectLabel="Level" selectItems={levelOptions} onChange={setLevel} />
            <SelectButton placeholder="Gender" selectLabel="Gender" selectItems={genderOptions} onChange={setGender} />
        </div>
        <button
            className="bg-gray-300 text-black px-10 py-3 mb-8 text-lg font-semibold border rounded-xl shadow-sm hover:shadow-md hover:bg-gray-200 transition"
            onClick={handleApply}
        >
            Apply Filters
        </button>
        <div className="w-full max-w-4xl overflow-x-auto rounded-xl border">
          <Table className="bg-white rounded-xl">
            <TableHeader className="bg-gray-300">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Tutor Type</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="rounded-xl">
              {filteredAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">No assignments found.</TableCell>
                </TableRow>
              ) : (
                filteredAssignments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.id}</TableCell>
                    <TableCell>{a.subject}</TableCell>
                    <TableCell className="capitalize">{a.level}</TableCell>
                    <TableCell className="capitalize">{a.tutorType.replace('-', ' ')}</TableCell>
                    <TableCell className="capitalize">{a.gender}</TableCell>
                    <TableCell>{a.location}</TableCell>
                    <TableCell className="text-right">{a.rate}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>Total Assignments</TableCell>
                <TableCell className="text-right">{filteredAssignments.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <TableCaption>A list of available tuition assignments.</TableCaption>
    </div>
  );
};

export default TuitionAssignments;