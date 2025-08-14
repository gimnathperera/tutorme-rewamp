"use client";

import React, { useState } from 'react'
import Skeleton from "react-loading-skeleton";
import { SelectButton } from "@/components/shared/select";
import tutorTypes from "@/lib/data/tuition-assignments/tutor-types";
import genders from "@/lib/data/tuition-assignments/genders";
import { useFetchGradesQuery } from '@/store/api/splits/grades';
import AssignmentList from './assignmentList';


const tutorTypeOptions = tutorTypes;
const genderOptions = genders;
const Filter = () => {
    const [tutorType, setTutorType] = useState("");
    const [gradeId, setGradeId] = useState("");
    const [gender, setGender] = useState("");
    const { data: gradesData, isLoading: isGradesLoading } = useFetchGradesQuery({ page: 1, limit: 100 });

    // For filtering only on Apply
    const [appliedFilters, setAppliedFilters] = useState({ tutorType: '', gradeId: '', gender: '' });

    const gradeOptions = gradesData?.results.map((grade) => ({
        label: grade.title,
        value: grade.id
    })) || [];

    const handleApply = () => {
        setAppliedFilters({ tutorType, gradeId, gender });
    };

    return (
        <div className='flex flex-col items-center'>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 mb-6 w-full max-w-3xl px-4 py-4 rounded-lg">
                {isGradesLoading ? (
                    <div className="w-full flex justify-center">
                        <Skeleton height={50} width={200} borderRadius={10} />
                    </div>
                ) : (
                    <SelectButton
                        placeholder="Tutor Type"
                        selectLabel="Tutor Type"
                        selectItems={tutorTypeOptions}
                        onChange={setTutorType}
                    />
                )}
                {isGradesLoading ? (
                    <div className="w-full flex justify-center">
                        <Skeleton height={50} width={200} borderRadius={10} />
                    </div>
                ) : (
                    <SelectButton
                        placeholder="Grade"
                        selectLabel="Grade"
                        selectItems={gradeOptions}
                        onChange={setGradeId}
                    />
                )}
                {isGradesLoading ? (
                    <div className="w-full flex justify-center">
                        <Skeleton height={50} width={200} borderRadius={10} />
                    </div>
                ) : (
                    <SelectButton
                        placeholder="Gender"
                        selectLabel="Gender"
                        selectItems={genderOptions}
                        onChange={setGender}
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
            <AssignmentList
                tutorType={appliedFilters.tutorType}
                gradeId={appliedFilters.gradeId}
                gender={appliedFilters.gender}
            />
        </div>
    )
}

export default Filter