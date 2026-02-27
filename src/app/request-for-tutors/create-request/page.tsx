"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
import LogoImage from "../../../../public/images/findTutor/tutor.png";
import Image from "next/image";
import { districts } from "@/configs/districts";
import CitySelect from "@/components/citySelect";
import DistrictSelect from "@/components/districtSelect";

/** ── Shared style tokens (mirrors register-tutor standard) ── */
const fieldWrapper = "flex flex-col gap-1";
const inputClass = "h-11";
const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-150";
const selectBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";
const errorMsg = "text-sm text-red-500 min-h-[1.25rem]";

const FETCH_LIMIT = LIMITS_CONFIG.FETCH_LIMIT;
const MAX_TUTOR_OPTIONS = LIMITS_CONFIG.MAX_TUTOR_OPTIONS;

type TabKey = "contact" | "tutorDetails";
const TAB_ORDER: TabKey[] = ["contact", "tutorDetails"];

export default function AddRequestForTutor() {
  const [tab, setTab] = useState<TabKey>("contact");
  const [selectedTutorCount, setSelectedTutorCount] = useState(1);
  /** null = closed, "success" = success dialog, string = error message dialog */
  const [submissionResult, setSubmissionResult] = useState<"success" | string | null>(null);

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
    mode: "onTouched",
    reValidateMode: "onChange",
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
      const payload = { ...data, status: "Pending" };
      const result = await createTutorRequest(payload);
      const error = getErrorInApiResult(result);
      if (error) {
        setSubmissionResult(error);
        return;
      }
      if ("data" in result) {
        setSubmissionResult("success");
      }
    } catch (err) {
      console.error(err);
      setSubmissionResult("Unexpected error occurred while creating the request. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setSubmissionResult(null);
    reset();
    clearErrors();
    setTab("contact");
    setSelectedTutorCount(1);
  };

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="text-2xl flex flex-row gap-2 items-center px-6 font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl">
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
                <div className={fieldWrapper}>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="e.g. Nimal Perera"
                    autoComplete="name"
                    className={`${inputClass} ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.name ? (
                    <p className={errorMsg}>{errors.name?.message}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground min-h-[1.25rem]">Letters and spaces only</p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={fieldWrapper}>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. johndoe@gmail.com"
                      autoComplete="email"
                      {...register("email")}
                      className={`${inputClass} ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.email ? (
                      <p className={errorMsg}>{errors.email?.message}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground min-h-[1.25rem]">Enter a valid email address</p>
                    )}
                  </div>
                  <div className={fieldWrapper}>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="e.g. 0712345678"
                      autoComplete="tel"
                      {...register("phoneNumber")}
                      className={`${inputClass} ${errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.phoneNumber ? (
                      <p className={errorMsg}>{errors.phoneNumber?.message}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground min-h-[1.25rem]">10-digit mobile number (digits only)</p>
                    )}
                  </div>
                </div>

                {/* District */}
                <div className={fieldWrapper}>
                  <Label htmlFor="district">District *</Label>
                  <Controller
                    control={control}
                    name="district"
                    render={({ field }) => (
                      <DistrictSelect
                        value={field.value || ""}
                        onChange={field.onChange}
                        districts={districts}
                        hasError={!!errors.district}
                      />
                    )}
                  />
                  <p className={errorMsg}>{errors.district?.message}</p>
                </div>

                {/* City */}
                <div className={fieldWrapper}>
                  <Label htmlFor="city">City *</Label>
                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <CitySelect
                        value={field.value || ""}
                        district={selectedDistrict || ""}
                        onChange={field.onChange}
                        hasError={!!errors.city}
                      />
                    )}
                  />
                  <p className={errorMsg}>{errors.city?.message}</p>
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
                <div className={fieldWrapper}>
                  <Label htmlFor="medium">Medium *</Label>
                  <select
                    id="medium"
                    {...register("medium")}
                    className={`${selectClass} ${selectBorder(!!errors.medium)}`}
                  >
                    <option value="" disabled hidden>Select medium of instruction</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                  <p className={errorMsg}>{errors.medium?.message}</p>
                </div>

                {/* Grade */}
                <div className={fieldWrapper}>
                  <Label htmlFor="grade">Grade *</Label>
                  <select
                    id="grade"
                    {...register("grade")}
                    className={`${selectClass} ${selectBorder(!!errors.grade)}`}
                  >
                    <option value="" disabled hidden>Select student's grade</option>
                    {gradeOptions.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.text}
                      </option>
                    ))}
                  </select>
                  <p className={errorMsg}>{errors.grade?.message}</p>
                </div>

                {/* Number of Tutors */}
                <div className={fieldWrapper}>
                  <Label htmlFor="tutorCount">Number of Tutors</Label>
                  <select
                    id="tutorCount"
                    value={selectedTutorCount}
                    onChange={(e) =>
                      setSelectedTutorCount(Number(e.target.value))
                    }
                    className={`${selectClass} border-gray-300 text-gray-900`}
                  >
                    {Array.from(
                      { length: MAX_TUTOR_OPTIONS },
                      (_, i) => i + 1,
                    ).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "tutor" : "tutors"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Per-tutor fields */}
                {tutors.map((tutor, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-md"
                  >
                    <h3 className="font-semibold mb-3">Tutor {index + 1}</h3>

                    {/* Subject */}
                    <div className={`${fieldWrapper} mb-4`}>
                      <Label htmlFor={`subject-${index}`}>Subject *</Label>
                      <select
                        id={`subject-${index}`}
                        {...register(`tutors.${index}.subject`)}
                        className={`${selectClass} ${selectBorder(!!errors.tutors?.[index]?.subject)}`}
                      >
                        <option value="" disabled hidden>
                          {selectedGradeId ? "Select subject" : "Select a grade first"}
                        </option>
                        {subjectOptions.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.text}
                          </option>
                        ))}
                      </select>
                      <p className={errorMsg}>
                        {errors.tutors?.[index]?.subject?.message}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Duration */}
                      <div className={fieldWrapper}>
                        <Label htmlFor={`duration-${index}`}>Duration *</Label>
                        <select
                          id={`duration-${index}`}
                          {...register(`tutors.${index}.duration`)}
                          className={`${selectClass} ${selectBorder(!!errors.tutors?.[index]?.duration)}`}
                        >
                          <option value="" disabled hidden>Select session duration</option>
                          <option value="30 Minutes">30 Minutes</option>
                          <option value="One Hour">1 Hour</option>
                          <option value="Two Hours">2 Hours</option>
                        </select>
                        <p className={errorMsg}>
                          {errors.tutors?.[index]?.duration?.message}
                        </p>
                      </div>

                      {/* Frequency */}
                      <div className={fieldWrapper}>
                        <Label htmlFor={`frequency-${index}`}>Frequency *</Label>
                        <select
                          id={`frequency-${index}`}
                          {...register(`tutors.${index}.frequency`)}
                          className={`${selectClass} ${selectBorder(!!errors.tutors?.[index]?.frequency)}`}
                        >
                          <option value="" disabled hidden>Select sessions per week</option>
                          <option value="Once a Week">Once a Week</option>
                          <option value="Twice a Week">Twice a Week</option>
                          <option value="Daily">Daily</option>
                        </select>
                        <p className={errorMsg}>
                          {errors.tutors?.[index]?.frequency?.message}
                        </p>
                      </div>
                    </div>

                    {/* Preferred Tutor Type */}
                    <div className={`${fieldWrapper} mt-4`}>
                      <Label htmlFor={`tutorType-${index}`}>Preferred Tutor Type *</Label>
                      <select
                        id={`tutorType-${index}`}
                        {...register(`tutors.${index}.preferredTutorType`)}
                        className={`${selectClass} ${selectBorder(!!errors.tutors?.[index]?.preferredTutorType)}`}
                      >
                        <option value="" disabled hidden>Select preferred tutor type</option>
                        <option value="Part Time Tutors">Part Time Tutors</option>
                        <option value="Full Time Tutors">Full Time Tutors</option>
                        <option value="Ex / Current Government School Tutors">Ex / Current Government School Tutors</option>
                      </select>
                      <p className={errorMsg}>
                        {errors.tutors?.[index]?.preferredTutorType?.message}
                      </p>
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

      {/* ── Success Dialog ── */}
      <Dialog open={submissionResult === "success"} onOpenChange={(o) => { if (!o) handleSuccessClose(); }}>
        <DialogContent className="max-w-md text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Request Submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Your tutor request has been submitted successfully. We&apos;ll match you with a suitable tutor and get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleSuccessClose}>
              Submit Another Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Error Dialog ── */}
      <Dialog
        open={typeof submissionResult === "string" && submissionResult !== "success"}
        onOpenChange={(o) => { if (!o) setSubmissionResult(null); }}
      >
        <DialogContent className="max-w-md text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Submission Failed</DialogTitle>
            <DialogDescription className="text-center">
              Something went wrong.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center mt-2">
            <Button onClick={() => setSubmissionResult(null)}>
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
