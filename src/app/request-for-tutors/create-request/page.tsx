"use client";

import { useState, useEffect } from "react";
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
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useCreateTutorRequestsMutation } from "@/store/api/splits/request-tutor";
import { getErrorInApiResult } from "@/utils/api";
import { LIMITS_CONFIG } from "@/configs/limits";
import LogoImage from "../../../../public/images/findTutor/lesson.png";
import Image from "next/image";
import { districts } from "@/configs/districts";
import CitySelect from "@/components/citySelect";
import DistrictSelect from "@/components/districtSelect";
import { AlertDialogDemo } from "./sucessDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const FETCH_LIMIT = LIMITS_CONFIG.FETCH_LIMIT;
const MAX_TUTOR_OPTIONS = LIMITS_CONFIG.MAX_TUTOR_OPTIONS;

export default function AddRequestForTutor() {
  const [step, setStep] = useState(1);
  const [selectedTutorCount, setSelectedTutorCount] = useState(1);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

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

  const { data: gradeData } = useFetchGradesQuery({
    page: 1,
    limit: FETCH_LIMIT,
  });
  const gradeOptions =
    gradeData?.results.map((g) => ({ value: g.id, text: g.title })) || [];

  const selectedGradeId = watch("grade.0");

  // Get subjects for the selected grade from gradeData
  const subjectOptions =
    gradeData?.results
      .find((g) => g.id === selectedGradeId)
      ?.subjects.map((s: any) => ({
        value: s.id,
        text: s.title,
      })) || [];

  const [createTutorRequest, { isLoading }] = useCreateTutorRequestsMutation();

  useEffect(() => {
    const currentCount = tutors.length;
    if (selectedTutorCount > currentCount) {
      const newTutors: CreateRequestTutorSchema["tutors"] = [...tutors];
      while (newTutors.length < selectedTutorCount) {
        newTutors.push({
          subjects: [],
          duration: "",
          frequency: "",
          preferredTutorType: "",
        });
      }
      setValue("tutors", newTutors);
    } else if (selectedTutorCount < currentCount) {
      setValue(
        "tutors",
        tutors.slice(
          0,
          selectedTutorCount,
        ) as CreateRequestTutorSchema["tutors"],
      );
    }
  }, [selectedTutorCount, tutors, setValue]);

  const onSubmit = async (data: CreateRequestTutorSchema) => {
    try {
      const payload = {
        ...data,
        status: "Pending",
      };

      const result = await createTutorRequest(payload);
      const error = getErrorInApiResult(result);

      if (error) {
        setAlertType("error");
        setAlertOpen(true);
        return;
      }

      if ("data" in result) {
        reset();
        setStep(1);
        setSelectedTutorCount(1);

        setAlertType("success");
        setAlertOpen(true);
      }
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertOpen(true);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const selectedDistrict = watch("district");

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="text-2xl flex flex-row gap-2 items-center px-6 font-bold mb-6  bg-gradient-to-r from-blue-500 to-indigo-600  text-white py-3 rounded">
        <Image height={50} width={50} src={LogoImage} alt="Logo image" />
        <h1>Request A Tutor</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 bg-white">
        {step === 1 && (
          <div className="p-6 flex flex-col gap-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g.John Doe"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  placeholder="e.g. johndoe@gmail.com"
                  id="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="e.g. 0712345678"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="district">District *</Label>
              <Controller
                control={control}
                name="district"
                render={({ field }) => (
                  <DistrictSelect
                    value={field.value || ""}
                    onChange={field.onChange}
                    districts={districts}
                  />
                )}
              />
              {errors.district && (
                <p className="text-sm text-red-500">
                  {errors.district.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="city">City *</Label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <CitySelect
                    value={field.value || ""}
                    district={selectedDistrict}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-gray-200 text-darkpurple hover:bg-gray-300"
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 flex flex-col gap-2">
            <div className="grid gap-2">
              <Label htmlFor="medium">Medium *</Label>
              <select
                id="medium"
                {...register("medium")}
                className="border border-gray-200 rounded p-2"
              >
                <option value="">Select Medium</option>
                <option value="Sinhala">Sinhala</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
              </select>
              {errors.medium && (
                <p className="text-sm text-red-500">{errors.medium.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="grade">Grade *</Label>
              <select
                id="grade"
                {...register("grade.0")}
                className="border border-gray-200 rounded p-2"
              >
                <option value="">Select Grade</option>
                {gradeOptions.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.text}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="text-sm text-red-500">{errors.grade.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Number of Tutors</Label>
              <select
                value={selectedTutorCount}
                onChange={(e) => setSelectedTutorCount(Number(e.target.value))}
                className="border border-gray-200 rounded p-2"
              >
                {Array.from({ length: MAX_TUTOR_OPTIONS }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ),
                )}
              </select>
            </div>

            {tutors.map((tutor, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded mb-4"
              >
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
                      className="border border-gray-200 rounded p-2"
                    >
                      <option value="">Select Duration</option>
                      <option value="30 Minutes">30 Minutes</option>
                      <option value="One Hour">One Hour</option>
                      <option value="Two Hours">Two Hours</option>
                    </select>
                    {errors.tutors?.[index]?.duration && (
                      <p className="text-sm text-red-500">
                        {errors.tutors[index]?.duration?.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Frequency *</Label>
                    <select
                      {...register(`tutors.${index}.frequency`)}
                      className="border border-gray-200 rounded p-2"
                    >
                      <option value="">Select Frequency</option>
                      <option value="Once a Week">Once a Week</option>
                      <option value="Twice a Week">Twice a Week</option>
                      <option value="Daily">Daily</option>
                    </select>
                    {errors.tutors?.[index]?.frequency && (
                      <p className="text-sm text-red-500">
                        {errors.tutors[index]?.frequency?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2 mt-2">
                  <Label>Preferred Tutor Type *</Label>
                  <select
                    {...register(`tutors.${index}.preferredTutorType`)}
                    className="border border-gray-200 rounded p-2"
                  >
                    <option value="">Select Tutor Type</option>
                    <option value="Part Time Tutors">Part Time Tutors</option>
                    <option value="Full Time Tutors">Full Time Tutors</option>
                    <option value="Ex / Current Government School Tutors">
                      Ex / Current Government School Tutors
                    </option>
                  </select>
                  {errors.tutors?.[index]?.preferredTutorType && (
                    <p className="text-sm text-red-500">
                      {errors.tutors[index]?.preferredTutorType?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-between gap-4 mt-4">
              <button
                type="button"
                className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-gray-200 text-darkpurple hover:bg-gray-300"
                onClick={prevStep}
              >
                Previous
              </button>
              <button
                type="submit"
                className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-black text-white hover:bg-gray-800"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertType === "success"
                ? "Your request has been submitted successfully"
                : "Something went wrong"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {alertType === "success"
                ? "We’ve sent the request details to your email. Our team is reviewing your request and will notify you once suitable tutors are available."
                : "We couldn’t submit your request at the moment. Please check your details and try again shortly."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-blue-600 text-white">
              Okey
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
