"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import MultiSelect from "@/components/shared/MultiSelect"

import {
  TUTORING_LEVEL_OPTIONS,
  PREFFERED_LOCATION_OPTIONS,
  TUTOR_TYPE_OPTIONS,
  HIGHEST_EDUCATION_LEVELS,
  MEDIUM_OPTIONS,
} from "@/configs/register-tutor"

import { useFetchGradesQuery } from "@/store/api/splits/grades"

const AcademicExperience = () => {
  const {
    register,
    control,
    watch, // ✅ FIX: destructure watch
    formState: { errors },
  } = useFormContext()

  const { data: gradeData } = useFetchGradesQuery({ page: 1, limit: 50 })

  const selectedGradeId = watch("grades")?.[0]

  const subjectOptions =
    gradeData?.results
      ?.find((g: any) => g.id === selectedGradeId)
      ?.subjects?.map((s: any) => ({
        value: s.id,
        text: s.title,
      })) || []

  return (
    <div className="space-y-8">
      {/* Tutoring Levels & Preferred Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Tutoring Levels *</Label>
          <Controller
            name="tutoringLevels"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={TUTORING_LEVEL_OPTIONS}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                label=""
              />
            )}
          />
          {errors.tutoringLevels && (
            <p className="text-sm text-red-500">
              {`${errors.tutoringLevels.message}`}
            </p>
          )}
        </div>

        <div>
          <Label>Preferred Locations *</Label>
          <Controller
            name="preferredLocations"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={PREFFERED_LOCATION_OPTIONS}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                label=""
              />
            )}
          />
          {errors.preferredLocations && (
            <p className="text-sm text-red-500">
              {`${errors.preferredLocations.message}`}
            </p>
          )}
        </div>
      </div>

      {/* Tutor Type & Highest Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Tutor Types *</Label>
          <Controller
            name="tutorType"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={TUTOR_TYPE_OPTIONS}
                defaultSelected={field.value || []}
                onChange={field.onChange}   // ✅ PASS ARRAY
                label=""
              />
            )}
          />
          {errors.tutorType && (
            <p className="text-sm text-red-500">
              {`${errors.tutorType.message}`}
            </p>
          )}
        </div>

        <div>
          <Label>Highest Education Level *</Label>
          <select {...register("highestEducation")} className="w-full border rounded p-2 border-gray-300 bg-white">
            <option value="">Select</option>
            <option value="PhD">PhD</option>
            <option value="Diploma">Diploma</option>
            <option value="Masters">Masters</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Bachelor Degree">Bachelor Degree</option>
            <option value="Diploma and Professional">Diploma and Professional</option>
            <option value="JC/A Levels">JC/A Levels</option>
            <option value="Poly">Poly</option>
            <option value="Others">Others</option>
          </select>
          {errors.highestEducation && (
            <p className="text-sm text-red-500">
              {`${errors.highestEducation.message}`}
            </p>
          )}
        </div>
      </div>

      {/* Years of Experience & Tutor Mediums */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Years of Experience *</Label>
          <Input
            type="number"
            {...register("yearsExperience", { valueAsNumber: true })}
            className="border rounded border-gray-300 bg-white"
          />
          {errors.yearsExperience && (
            <p className="text-sm text-red-500">
              {`${errors.yearsExperience.message}`}
            </p>
          )}
        </div>

        <div>
          <Label>Tutor Mediums *</Label>
          <Controller
            name="tutorMediums"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={MEDIUM_OPTIONS}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                label=""
              />
            )}
          />
          {errors.tutorMediums && (
            <p className="text-sm text-red-500">
              {`${errors.tutorMediums.message}`}
            </p>
          )}
        </div>
      </div>

      {/* Grades & Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Grades *</Label>
          <Controller
            name="grades"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={
                  gradeData?.results?.map((g: any) => ({
                    value: g.id,
                    text: g.title,
                  })) || []
                }
                defaultSelected={field.value || []}
                onChange={field.onChange}
                label=""
              />
            )}
          />
          {errors.grades && (
            <p className="text-sm text-red-500">
              {`${errors.grades.message}`}
            </p>
          )}
        </div>

        <div>
          <Label>Subjects *</Label>
          <Controller
            name="subjects"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={subjectOptions}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                label=""
              />
            )}
          />
          {errors.subjects && (
            <p className="text-sm text-red-500">
              {`${errors.subjects.message}`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AcademicExperience
