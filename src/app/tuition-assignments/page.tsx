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

  const assignments = useMemo<Assignment[]>(() => assignmentList, []);

  const handleApply = () => {
    let filtered = assignments;
    if (tutorType) filtered = filtered.filter(a => a.tutorType === tutorType);
    if (level) filtered = filtered.filter(a => a.level === level);
    if (gender) filtered = filtered.filter(a => a.gender === gender || a.gender === "any" || gender === "any");
    setFilteredAssignments(filtered);
  };

  React.useEffect(() => {
    setFilteredAssignments(assignments);
  }, [assignments]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-4 sm:px-8 md:px-16 lg:px-32 py-10 rounded-xl border">
      <p className="font-extrabold text-3xl sm:text-4xl py-6 text-center">Find A Tutor</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 mb-6 w-full max-w-3xl px-4 py-4 rounded-lg">
        <SelectButton
          placeholder="Tutor Type"
          selectLabel="Tutor Type"
          selectItems={tutorTypeOptions}
          onChange={setTutorType}
        />
        <SelectButton
          placeholder="Level"
          selectLabel="Level"
          selectItems={levelOptions}
          onChange={setLevel}
        />
        <SelectButton
          placeholder="Gender"
          selectLabel="Gender"
          selectItems={genderOptions}
          onChange={setGender}
        />
      </div>

      <button
        className="text-sm mb-12 md:text-xl font-semibold hover:shadow-xl bg-primary-700 text-white py-3 px-6 md:py-5 md:px-14 rounded-full hover:opacity-90"
        onClick={handleApply}
      >
        Apply Filters
      </button>

      {/* Table */}
      <div className="w-full overflow-x-auto max-w-5xl border border-gray-300 rounded-xl">
        <Table className="min-w-[600px] bg-white rounded-xl">
          <TableHeader className="bg-primary-700 text-white font-bold text-base">
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
          <TableBody>
            {filteredAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No assignments found.
                </TableCell>
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
      <TableCaption className="text-center mt-2">A list of available tuition assignments.</TableCaption>
    </div>
  );
};

export default TuitionAssignments;
