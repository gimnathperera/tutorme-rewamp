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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useCreateTutorRequestsMutation } from "@/store/api/splits/request-tutor";
import { getErrorInApiResult } from "@/utils/api";
import { LIMITS_CONFIG } from "@/configs/limits";
import LogoImage from "../../../../public/images/findTutor/lesson.png";
import Image from "next/image";
import { districts } from "@/configs/districts";
import CitySelect from "@/components/citySelect";
import DistrictSelect from "@/components/districtSelect";

const FETCH_LIMIT = LIMITS_CONFIG.FETCH_LIMIT;
const MAX_TUTOR_OPTIONS = LIMITS_CONFIG.MAX_TUTOR_OPTIONS;

type TabKey = "contact" | "tutorDetails";
const TAB_ORDER: TabKey[] = ["contact", "tutorDetails"];

export default function AddRequestForTutor() {
  const [tab, setTab] = useState<TabKey>("contact");
  const [selectedTutorCount, setSelectedTutorCount] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<CreateRequestTutorSchema>({
    resolver: zodResolver(createRequestTutorSchema),
    defaultValues: initialFormValues,
  });

  const tutors = watch("tutors");
  const selectedGradeId = watch("grade");
  const selectedDistrict = watch("district");

  const { data: gradeData } = useFetchGradesQuery({
    page: 1,
    limit: FETCH_LIMIT,
  });

  const gradeOptions =
    gradeData?.results.map((g) => ({ value: g.id, text: g.title })) || [];

  const subjectOptions =
    gradeData?.results
      .find((g) => g.id === selectedGradeId)
      ?.subjects.map((s: any) => ({
        value: s.id,
        text: s.title,
      })) || [];

  const [createTutorRequest, { isLoading }] = useCreateTutorRequestsMutation();

  const currentIndex = TAB_ORDER.indexOf(tab);

  useEffect(() => {
    const currentCount = tutors.length;
    if (selectedTutorCount > currentCount) {
      const newTutors: CreateRequestTutorSchema["tutors"] = [...tutors];
      while (newTutors.length < selectedTutorCount) {
        newTutors.push({
          subject: "",
          assignedTutor: "",
          duration: "30 Minutes",
          frequency: "Once a Week",
          preferredTutorType: "Part Time Tutors",
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

  const nextStep = async () => {
    if (tab === "contact") {
      const valid = await trigger([
        "name",
        "email",
        "phoneNumber",
        "district",
        "city",
      ]);
      if (!valid) return;
    }
    setTab(TAB_ORDER[currentIndex + 1]);
  };

  const prevStep = () => {
    setTab(TAB_ORDER[currentIndex - 1]);
  };

  const onSubmit = async (data: CreateRequestTutorSchema) => {
    try {
      const payload = {
        ...data,
        status: "Pending",
      };

      const result = await createTutorRequest(payload);
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);

      if ("data" in result) {
        toast.success("Tutor request created successfully!");
        reset();
        clearErrors();
        setTab("contact");
        setSelectedTutorCount(1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred while creating the request.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="text-2xl flex flex-row gap-2 items-center px-6 font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded">
        <Image height={50} width={50} src={LogoImage} alt="Logo image" />
        <h1>Request A Tutor</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={tab} className="w-full">
          {/* ── STEP 1: Contact Details ── */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="e.g. John Doe"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      placeholder="e.g. johndoe@gmail.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
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

                {/* District */}
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

                {/* City */}
                <div className="grid gap-2">
                  <Label htmlFor="city">City *</Label>
                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <CitySelect
                        value={field.value || ""}
                        district={selectedDistrict || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ── STEP 2: Tutor Details ── */}
          <TabsContent value="tutorDetails">
            <Card>
              <CardHeader>
                <CardTitle>Tutor Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Medium */}
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
                    <p className="text-sm text-red-500">
                      {errors.medium.message}
                    </p>
                  )}
                </div>

                {/* Grade */}
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade *</Label>
                  <select
                    id="grade"
                    {...register("grade")}
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
                    <p className="text-sm text-red-500">
                      {errors.grade.message}
                    </p>
                  )}
                </div>

                {/* Number of Tutors */}
                <div className="grid gap-2">
                  <Label>Number of Tutors</Label>
                  <select
                    value={selectedTutorCount}
                    onChange={(e) =>
                      setSelectedTutorCount(Number(e.target.value))
                    }
                    className="border border-gray-200 rounded p-2"
                  >
                    {Array.from(
                      { length: MAX_TUTOR_OPTIONS },
                      (_, i) => i + 1,
                    ).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Per-tutor fields */}
                {tutors.map((tutor, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded"
                  >
                    <h3 className="font-semibold mb-2">Tutor {index + 1}</h3>

                    <div className="grid gap-2 mb-2">
                      <Label>Subject *</Label>
                      <select
                        {...register(`tutors.${index}.subject`)}
                        className="border border-gray-200 rounded p-2"
                      >
                        <option value="">Select Subject</option>
                        {subjectOptions.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.text}
                          </option>
                        ))}
                      </select>
                      {errors.tutors?.[index]?.subject && (
                        <p className="text-sm text-red-500">
                          {errors.tutors[index]?.subject?.message}
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
                        <option value="Part Time Tutors">
                          Part Time Tutors
                        </option>
                        <option value="Full Time Tutors">
                          Full Time Tutors
                        </option>
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
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
