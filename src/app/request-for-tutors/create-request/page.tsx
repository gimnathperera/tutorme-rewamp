"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  createRequestTutorSchema,
  CreateRequestTutorSchema,
  initialFormValues,
} from "./schema";
import MultiSelect from "@/components/shared/MultiSelect";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button/button";
import { useFetchSubjectsQuery } from "@/store/api/splits/subjects";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useCreateTutorRequestsMutation } from "@/store/api/splits/request-tutor";
import { getErrorInApiResult } from "@/utils/api";
import Person from "../../../../public/images/findTutor/person.png";
import TutorImage from "../../../../public/images/findTutor/tutor.png";
import Lesson from "../../../../public/images/findTutor/lesson.png";
import Image from "next/image";

const FETCH_LIMIT = 100;
const MAX_TUTOR_OPTIONS = [1, 2, 3, 4];

export default function AddRequestForTutor() {
  const [selectedTutorCount, setSelectedTutorCount] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateRequestTutorSchema>({
    resolver: zodResolver(createRequestTutorSchema),
    defaultValues: initialFormValues,
  });

  const tutors = watch("tutors");

  const { data: subjectData, isLoading: subjectsLoading } =
    useFetchSubjectsQuery({ page: 1, limit: FETCH_LIMIT });
  const subjectOptions =
    subjectData?.results.map((s) => ({
      value: s.id,
      text: s.title,
      selected: false,
    })) || [];

  const { data: GradeData, isLoading: gradesLoading } = useFetchGradesQuery({
    page: 1,
    limit: FETCH_LIMIT,
  });
  const gradeOptions =
    GradeData?.results.map((g) => ({
      value: g.id,
      text: g.title,
      selected: false,
    })) || [];

  const [createTutorRequest, { isLoading }] = useCreateTutorRequestsMutation();

  useEffect(() => {
    const currentCount = tutors.length;
    if (selectedTutorCount > currentCount) {
      const newTutors: CreateRequestTutorSchema["tutors"] = [...tutors];
      while (newTutors.length < selectedTutorCount) {
        newTutors.push({
          subjects: [],
          duration: "30 Minutes",
          frequency: "Once a Week",
        });
      }
      setValue("tutors", newTutors);
    } else if (selectedTutorCount < currentCount) {
      setValue(
        "tutors",
        tutors.slice(
          0,
          selectedTutorCount
        ) as CreateRequestTutorSchema["tutors"]
      );
    }
  }, [selectedTutorCount, tutors, setValue]);

  const onSubmit = async (data: CreateRequestTutorSchema) => {
    try {
      const result = await createTutorRequest(data);
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);

      if ("data" in result) {
        toast.success("Tutor request created successfully!");
        reset();
        setSelectedTutorCount(1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred while creating the request.");
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">
        Find A Tutor
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-10">
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <Image
              src={Person}
              alt="person-image"
              className="w-16 h-16 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px]"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Use a permanent address where you can receive mail.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Name Fields */}
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input id="phoneNumber" {...register("phoneNumber")} />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: "city", label: "City *" },
                { id: "state", label: "State *" },
                { id: "region", label: "Region *" },
                { id: "zip", label: "ZIP *" },
              ].map(({ id, label }) => (
                <div key={id} className="grid gap-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    {...register(id as keyof CreateRequestTutorSchema)}
                  />
                  {errors[id as keyof CreateRequestTutorSchema] && (
                    <p className="text-sm text-red-500">
                      {
                        errors[id as keyof CreateRequestTutorSchema]
                          ?.message as string | undefined
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Grade Selection */}
            <div className="grid gap-2">
              <Label>Grades *</Label>
              <Controller
                name="grade"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={gradeOptions}
                    defaultSelected={field.value || []}
                    onChange={(vals) => field.onChange(vals)}
                    label=""
                  />
                )}
              />
              {errors.grade && (
                <p className="text-sm text-red-500">{errors.grade.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tutor Type Selection */}
        <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-10">
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <Image
              src={TutorImage}
              alt="tutor-image"
              className="w-16 h-16 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px]"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Tutor Type Selection
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Choose how many tutors you’d like to request and their
                preferences.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label>Number of Tutors</Label>
              <select
                value={selectedTutorCount}
                onChange={(e) => setSelectedTutorCount(Number(e.target.value))}
                className="border border-gray-200 rounded p-2"
              >
                {MAX_TUTOR_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Tutors */}
            {tutors.map((tutor, index) => (
              <div key={index} className="p-4 border rounded mb-4">
                <h3 className="font-semibold mb-2">Tutor {index + 1}</h3>

                <div className="grid gap-2 mb-2">
                  <Label>Subjects *</Label>
                  <Controller
                    name={`tutors.${index}.subjects`}
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        options={subjectOptions}
                        defaultSelected={field.value || []}
                        onChange={(vals) => field.onChange(vals)}
                        label=""
                      />
                    )}
                  />
                  {errors.tutors?.[index]?.subjects && (
                    <p className="text-sm text-red-500">
                      {errors.tutors[index]?.subjects?.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Duration *</Label>
                    <select
                      {...register(`tutors.${index}.duration`)}
                      className="border text-sm py-3 border-gray-200 rounded p-2"
                    >
                      <option value="">Select an option</option>
                      {["30 Minutes", "One Hour", "Two Hours"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Frequency *</Label>
                    <select
                      {...register(`tutors.${index}.frequency`)}
                      className="border text-sm py-3 border-gray-200 bg-white rounded p-2"
                    >
                      <option value="">Select an option</option>
                      {["Once a Week", "Twice a Week", "Daily"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Details */}
        <div className="bg-white p-4 sm:p-6 lg:p-10 rounded-lg">
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <Image
              src={Lesson}
              alt="lesson-image"
              className="w-16 h-16 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px]"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Lesson Details
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Provide details about your preferred tutor and learning setup.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* Preferred Tutor Type */}
            <div className="grid gap-2">
              <Label>Preferred Tutor Type *</Label>
              <select
                {...register("preferredTutorType")}
                className="border text-sm py-3 border-gray-200 rounded p-2"
              >
                <option value="">Select an option</option>
                <option value="Part Time Tutors">Part Time Tutors</option>
                <option value="Full Time Tutors">Full Time Tutors</option>
                <option value="Ex / Current Government School Tutors">
                  Ex / Current Government School Tutors
                </option>
              </select>
              {errors.preferredTutorType && (
                <p className="text-sm text-red-500">
                  {errors.preferredTutorType.message}
                </p>
              )}
            </div>

            {/* Student School */}
            <div className="grid gap-2">
              <Label>Student School *</Label>
              <Input {...register("studentSchool")} />
              {errors.studentSchool && (
                <p className="text-sm text-red-500">
                  {errors.studentSchool.message}
                </p>
              )}
            </div>

            {/* Gender Preference & Bilingual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Gender Preference *</Label>
                <select
                  {...register("genderPreference")}
                  className="border text-sm py-3 border-gray-200 rounded p-2"
                >
                  <option value="">Select an option</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
                {errors.genderPreference && (
                  <p className="text-sm text-red-500">
                    {errors.genderPreference.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Is Bilingual Tutor Required? *</Label>
                <select
                  {...register("bilingual")}
                  className="border text-sm py-3 border-gray-200 rounded p-2"
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.bilingual && (
                  <p className="text-sm text-red-500">
                    {errors.bilingual.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-blue-700 text-white hover:bg-blue-500 w-full sm:w-auto"
          isLoading={isLoading}
        >
          Request Tutor
        </Button>
      </form>
    </div>
  );
}
