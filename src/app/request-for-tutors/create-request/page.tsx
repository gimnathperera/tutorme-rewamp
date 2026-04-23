"use client";

import { useState, useEffect, useRef } from "react";
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
const fieldWrapper = "flex flex-col gap-2";
const inputClass = "h-11 text-sm placeholder:text-gray-500 text-gray-900";
const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-150 text-gray-900";
const selectBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";
const errorMsg = "text-xs text-red-500 min-h-[1.25rem]";

const FETCH_LIMIT = LIMITS_CONFIG.FETCH_LIMIT;
const MAX_TUTOR_OPTIONS = LIMITS_CONFIG.MAX_TUTOR_OPTIONS;

/**
 * Strip leading spaces immediately; on blur collapse multiple internal spaces
 * so the stored value is always clean.
 */
const stripLeadingSpaces = (value: string) => value.replace(/^ +/, "");
const collapseSpaces = (value: string) =>
  value.replace(/^ +/, "").replace(/ {2,}/g, " ").trimEnd();

type TabKey = "contact" | "tutorDetails";
const TAB_ORDER: TabKey[] = ["contact", "tutorDetails"];

export default function AddRequestForTutor() {
  const [tab, setTab] = useState<TabKey>("contact");
  const [selectedTutorCount, setSelectedTutorCount] = useState(1);
  /** null = closed, "success" = success dialog, string = error message dialog */
  const [submissionResult, setSubmissionResult] = useState<
    "success" | string | null
  >(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    clearErrors,
    formState: { errors, isValid },
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
  const [watchName, watchEmail, watchPhone, watchCity] = watch(["name", "email", "phoneNumber", "city"]);

  const isStep1Complete =
    !!watchName && !!watchEmail && !!watchPhone && !!selectedDistrict && !!watchCity &&
    !errors.name && !errors.email && !errors.phoneNumber && !errors.district && !errors.city;

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

  const changeStep = (nextTab: TabKey) => {
    setTab(nextTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const currentCount = tutors.length;
    if (selectedTutorCount > currentCount) {
      const newTutors: CreateRequestTutorSchema["tutors"] = [...tutors];
      while (newTutors.length < selectedTutorCount) {
        newTutors.push({
          subject: "",
          assignedTutor: "",
          duration: "",
          frequency: "",
          preferredTutorType: "",
          preferredClassType: "",
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

  // Reset subject for every tutor when grade changes (skip initial mount)
  const isFirstGradeMount = useRef(true);
  useEffect(() => {
    if (isFirstGradeMount.current) {
      isFirstGradeMount.current = false;
      return;
    }
    tutors.forEach((_, i) => setValue(`tutors.${i}.subject`, ""));
  }, [selectedGradeId]); // eslint-disable-line react-hooks/exhaustive-deps

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
    changeStep(TAB_ORDER[currentIndex + 1]);
  };

  const prevStep = () => {
    changeStep(TAB_ORDER[currentIndex - 1]);
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
      setSubmissionResult(
        "Unexpected error occurred while creating the request. Please try again.",
      );
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
      <div className="text-3xl flex flex-row gap-2 items-center px-6 font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl">
        <Image height={50} width={50} src={LogoImage} alt="Logo image" />
        <h1 className="text-3xl text-white font-bold">Request for Tutor</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={tab} className="w-full">
          {/* ── STEP 1: Contact Details ── */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Full Name */}
                <div className={fieldWrapper}>
                  <Label className="text-sm" htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name", {
                      onChange: (e) => {
                        // strip leading spaces as the user types
                        const cleaned = stripLeadingSpaces(e.target.value);
                        if (cleaned !== e.target.value) {
                          setValue("name", cleaned, { shouldValidate: true });
                        }
                      },
                      onBlur: (e) => {
                        // fully normalize on blur (collapse multiple spaces too)
                        setValue("name", collapseSpaces(e.target.value), {
                          shouldValidate: true,
                        });
                      },
                    })}
                    placeholder="e.g. Nimal Perera"
                    autoComplete="name"
                    className={`${inputClass} ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.name ? (
                    <p className={errorMsg}>{errors.name?.message}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground min-h-[1.25rem]">
                      Letters and spaces only
                    </p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={fieldWrapper}>
                    <Label className="text-sm" htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. johndoe@gmail.com"
                      autoComplete="email"
                      {...register("email", {
                        onChange: (e) => {
                          // strip every space character as the user types
                          const noSpaces = e.target.value.replace(/ /g, "");
                          if (noSpaces !== e.target.value) {
                            setValue("email", noSpaces, {
                              shouldValidate: true,
                            });
                          }
                        },
                        onBlur: (e) => {
                          setValue("email", e.target.value.replace(/ /g, ""), {
                            shouldValidate: true,
                          });
                        },
                      })}
                      className={`${inputClass} ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.email ? (
                      <p className={errorMsg}>{errors.email?.message}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground min-h-[1.25rem]">
                        Enter a valid email address
                      </p>
                    )}
                  </div>
                  <div className={fieldWrapper}>
                    <Label className="text-sm" htmlFor="phoneNumber">
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="e.g. 0712345678"
                      autoComplete="tel"
                      {...register("phoneNumber", {
                        onChange: (e) => {
                          // strip every space character as the user types
                          const noSpaces = e.target.value.replace(/ /g, "");
                          if (noSpaces !== e.target.value) {
                            setValue("phoneNumber", noSpaces, {
                              shouldValidate: true,
                            });
                          }
                        },
                        onBlur: (e) => {
                          setValue(
                            "phoneNumber",
                            e.target.value.replace(/ /g, ""),
                            {
                              shouldValidate: true,
                            },
                          );
                        },
                      })}
                      className={`${inputClass} ${errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.phoneNumber ? (
                      <p className={errorMsg}>{errors.phoneNumber?.message}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground min-h-[1.25rem]">
                        10-digit mobile number (digits only)
                      </p>
                    )}
                  </div>
                </div>

                {/* District + City – grouped to reduce spacing between them */}
                <div className="flex flex-col gap-4">
                  {/* District */}
                  <div className={fieldWrapper}>
                    <Label className="text-sm" htmlFor="district">
                      District <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="district"
                      render={({ field }) => (
                        <DistrictSelect
                          value={field.value || ""}
                          onChange={(val) => {
                            field.onChange(val);
                            if (val) clearErrors("district");
                          }}
                          districts={districts}
                          hasError={!!errors.district}
                        />
                      )}
                    />
                    {errors.district?.message && (
                      <p className={errorMsg}>{errors.district.message}</p>
                    )}
                  </div>

                  {/* City */}
                  <div className={fieldWrapper}>
                    <Label className="text-sm" htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <CitySelect
                          value={field.value || ""}
                          district={selectedDistrict || ""}
                          onChange={(val) => {
                            field.onChange(val);
                            if (val) clearErrors("city");
                          }}
                          hasError={!!errors.city}
                        />
                      )}
                    />
                    {errors.city?.message && (
                      <p className={errorMsg}>{errors.city.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button
                  type="button"
                  onClick={nextStep}
                  className={isStep1Complete ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ── STEP 2: Tutor Details ── */}
          <TabsContent value="tutorDetails">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Tutor Details
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Medium */}
                <div className={fieldWrapper}>
                  <Label className="text-sm" htmlFor="medium">
                    Medium <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="medium"
                    {...register("medium")}
                    className={`${selectClass} ${selectBorder(!!errors.medium)}`}
                  >
                    <option value="" disabled hidden>
                      Select medium of instruction
                    </option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                  <p className={errorMsg}>{errors.medium?.message}</p>
                </div>

                {/* Grade */}
                <div className={fieldWrapper}>
                  <Label className="text-sm" htmlFor="grade">
                    Grade <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="grade"
                    {...register("grade")}
                    className={`${selectClass} ${selectBorder(!!errors.grade)}`}
                  >
                    <option value="" disabled hidden>
                      Select student&apos;s grade
                    </option>
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
                  <Label className="text-sm" htmlFor="tutorCount">
                    Number of Tutors
                  </Label>
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
                    <h3 className="text-base font-semibold mb-3">
                      Tutor {index + 1}
                    </h3>

                    {/* Subject */}
                    <div className={`${fieldWrapper} mb-4`}>
                      <Label className="text-sm" htmlFor={`subject-${index}`}>
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id={`subject-${index}`}
                        {...register(`tutors.${index}.subject`)}
                        disabled={!selectedGradeId}
                        className={`${selectClass} ${selectBorder(!!errors.tutors?.[index]?.subject)} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                      >
                        <option value="" disabled hidden>
                          {selectedGradeId
                            ? "Select subject"
                            : "Select a grade first"}
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
                        <Label
                          className="text-sm"
                          htmlFor={`duration-${index}`}
                        >
                          Duration <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id={`duration-${index}`}
                          {...register(`tutors.${index}.duration`)}
                          className={`${selectClass} ${selectBorder(!!errors.tutors?.[index]?.duration)}`}
                        >
                          <option value="" disabled hidden>
                            Select session duration
                          </option>
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
                        <Label
                          className="text-sm"
                          htmlFor={`frequency-${index}`}
                        >
                          Frequency <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id={`frequency-${index}`}
                          {...register(`tutors.${index}.frequency`)}
                          className={`${selectClass} ${selectBorder(!!errors.tutors?.[index]?.frequency)}`}
                        >
                          <option value="" disabled hidden>
                            Select sessions per week
                          </option>
                          <option value="Once a Week">Once a Week</option>
                          <option value="Twice a Week">Twice a Week</option>
                          <option value="Daily">Daily</option>
                        </select>
                        <p className={errorMsg}>
                          {errors.tutors?.[index]?.frequency?.message}
                        </p>
                      </div>
                    </div>

                    {/* Preferred Tutor Type + Preferred Class Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className={fieldWrapper}>
                        <Label className="text-sm" htmlFor={`tutorType-${index}`}>
                          Preferred Tutor Type{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id={`tutorType-${index}`}
                          {...register(`tutors.${index}.preferredTutorType`)}
                          className={`${selectClass} ${selectBorder(!!errors.tutors?.[index]?.preferredTutorType)}`}
                        >
                          <option value="" disabled hidden>
                            Select preferred tutor type
                          </option>
                          <option value="Private Tutor">Private Tutor</option>
                          <option value="Government Teacher">Government Teacher</option>
                          <option value="University Student">University Student</option>
                          <option value="Coach">Coach</option>
                        </select>
                        <p className={errorMsg}>
                          {errors.tutors?.[index]?.preferredTutorType?.message}
                        </p>
                      </div>

                      <div className={fieldWrapper}>
                        <Label className="text-sm" htmlFor={`classType-${index}`}>
                          Preferred Class Type{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id={`classType-${index}`}
                          {...register(`tutors.${index}.preferredClassType`)}
                          className={`${selectClass} ${selectBorder(!!errors.tutors?.[index]?.preferredClassType)}`}
                        >
                          <option value="" disabled hidden>
                            Select preferred class type
                          </option>
                          <option value="Online - Individual">Online - Individual</option>
                          <option value="Online - Group">Online - Group</option>
                          <option value="Physical - Individual">Physical - Individual</option>
                          <option value="Physical - Group">Physical - Group</option>
                        </select>
                        <p className={errorMsg}>
                          {errors.tutors?.[index]?.preferredClassType?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={isValid ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>

      {/* ── Success Dialog ── */}
      <Dialog
        open={submissionResult === "success"}
        onOpenChange={(o) => {
          if (!o) handleSuccessClose();
        }}
      >
        <DialogContent className="max-w-md text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Request is processing
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Your tutor request has been submitted successfully. We&apos;ll
              match you with a suitable tutor and get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleSuccessClose}
            >
              Submit Another Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Error Dialog ── */}
      <Dialog
        open={
          typeof submissionResult === "string" && submissionResult !== "success"
        }
        onOpenChange={(o) => {
          if (!o) setSubmissionResult(null);
        }}
      >
        <DialogContent className="max-w-md text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Submission Failed
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Something went wrong.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center mt-2">
            <Button onClick={() => setSubmissionResult(null)}>Try Again</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
