"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
import LogoImage from "/images/findTutor/tutor.png";
import Image from "next/image";
import { districts } from "@/configs/districts";
import CitySelect from "@/components/citySelect";
import DistrictSelect from "@/components/districtSelect";
import {
  collapseTextSpaces,
  removeWhitespace,
  stripLeadingSpaces,
} from "@/utils/form-normalizers";
import { useTranslations } from "next-intl";
import { useTranslateItems } from "@/hooks/useTranslateItems";
import MultiSelect from "@/components/shared/MultiSelect";

/** ── Shared style tokens (mirrors register-tutor standard) ── */
const fieldWrapper = "flex flex-col gap-2";
const inputClass = "h-11 text-sm placeholder:text-gray-500 text-gray-900";
const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-150";
const errorMsg = "text-xs text-red-500 min-h-[1.25rem]";
const primaryActionButtonClassName = "bg-blue-600 text-white hover:bg-blue-700";

const FETCH_LIMIT = LIMITS_CONFIG.FETCH_LIMIT;
const MAX_TUTOR_OPTIONS = LIMITS_CONFIG.MAX_TUTOR_OPTIONS;

const preventWhitespaceKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (/\s/.test(event.key)) {
    event.preventDefault();
  }
};

type TabKey = "contact" | "tutorDetails";
const TAB_ORDER: TabKey[] = ["contact", "tutorDetails"];

export default function AddRequestForTutor() {
  const t = useTranslations("requestForTutor");
  const schema = useMemo(() => createRequestTutorSchema(t), [t]);
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
    formState: { errors },
    reset,
  } = useForm<CreateRequestTutorSchema>({
    resolver: zodResolver(schema),
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

  const rawGradeOptions = useMemo(
    () => gradeData?.results.map((g) => ({ value: g.id, text: g.title })) ?? [],
    [gradeData],
  );
  const gradeOptions = useTranslateItems(
    rawGradeOptions,
    (g) => [g.text],
    (g, [text]) => ({ ...g, text: text ?? g.text }),
  );

  const rawSubjectOptions = useMemo(
    () =>
      gradeData?.results
        .find((g) => g.id === selectedGradeId)
        ?.subjects.map((s: any) => ({ value: s.id, text: s.title })) ?? [],
    [gradeData, selectedGradeId],
  );
  const subjectOptions = useTranslateItems(
    rawSubjectOptions,
    (s) => [s.text],
    (s, [text]) => ({ ...s, text: text ?? s.text }),
  );

  // Static options with translated display text (values stay in English for backend)
  const mediumOptions = useMemo(
    () => [
      { value: "Sinhala", text: t("optMediumSinhala") },
      { value: "English", text: t("optMediumEnglish") },
      { value: "Tamil", text: t("optMediumTamil") },
    ],
    [t],
  );
  const durationOptions = useMemo(
    () => [
      { value: "30 Minutes", text: t("optDuration30Min") },
      { value: "One Hour", text: t("optDuration1Hour") },
      { value: "Two Hours", text: t("optDuration2Hours") },
    ],
    [t],
  );
  const frequencyOptions = useMemo(
    () => [
      { value: "Once a Week", text: t("optFrequencyOnceWeek") },
      { value: "Twice a Week", text: t("optFrequencyTwiceWeek") },
      { value: "Daily", text: t("optFrequencyDaily") },
    ],
    [t],
  );
  const tutorTypeOptions = useMemo(
    () => [
      {
        value: "International School Teacher",
        text: t("optTutorTypeInternational"),
      },
      { value: "Government School Teacher", text: t("optTutorTypeGovernment") },
      { value: "University Student", text: t("optTutorTypeUniversity") },
      { value: "A/L Student", text: t("optTutorTypeAL") },
      { value: "Diploma Holder", text: t("optTutorTypeDiploma") },
      { value: "Part-time Tutor", text: t("optTutorTypePartTime") },
      { value: "Full-time Tutor", text: t("optTutorTypeFullTime") },
    ],
    [t],
  );
  const classTypeOptions = useMemo(
    () => [
      { value: "Online - Individual", text: t("optClassTypeOnlineIndividual") },
      { value: "Online - Group", text: t("optClassTypeOnlineGroup") },
      {
        value: "Physical - Individual",
        text: t("optClassTypePhysicalIndividual"),
      },
      { value: "Physical - Group", text: t("optClassTypePhysicalGroup") },
    ],
    [t],
  );

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
      setSubmissionResult(t("unexpectedError"));
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
        <h1 className="text-3xl text-white font-bold">{t("pageTitle")}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={tab} className="w-full">
          {/* ── STEP 1: Contact Details ── */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  {t("contactDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Full Name */}
                <div className={fieldWrapper}>
                  <Label className="text-sm" htmlFor="name">
                    {t("fullName")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name", {
                      onChange: (e) => {
                        // strip leading spaces as the user types
                        const cleaned = stripLeadingSpaces(e.target.value);
                        if (cleaned !== e.target.value) {
                          e.target.value = cleaned;
                          setValue("name", cleaned, { shouldValidate: true });
                        }
                      },
                      onBlur: (e) => {
                        // fully normalize on blur (collapse multiple spaces too)
                        setValue("name", collapseTextSpaces(e.target.value), {
                          shouldValidate: true,
                        });
                      },
                    })}
                    placeholder={t("fullNamePlaceholder")}
                    autoComplete="name"
                    className={`${inputClass} ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.name ? (
                    <p className={errorMsg}>{errors.name?.message}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground min-h-[1.25rem]">
                      {t("fullNameHint")}
                    </p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={fieldWrapper}>
                    <Label className="text-sm" htmlFor="email">
                      {t("email")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      autoComplete="email"
                      onKeyDown={preventWhitespaceKey}
                      {...register("email", {
                        onChange: (e) => {
                          // strip every space character as the user types
                          const noSpaces = removeWhitespace(e.target.value);
                          if (noSpaces !== e.target.value) {
                            e.target.value = noSpaces;
                            setValue("email", noSpaces, {
                              shouldValidate: true,
                            });
                          }
                        },
                        onBlur: (e) => {
                          setValue("email", removeWhitespace(e.target.value), {
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
                        {t("emailHint")}
                      </p>
                    )}
                  </div>
                  <div className={fieldWrapper}>
                    <Label className="text-sm" htmlFor="phoneNumber">
                      {t("contactNumber")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder={t("contactNumberPlaceholder")}
                      autoComplete="tel"
                      onKeyDown={preventWhitespaceKey}
                      {...register("phoneNumber", {
                        onChange: (e) => {
                          // strip every space character as the user types
                          const noSpaces = removeWhitespace(e.target.value);
                          if (noSpaces !== e.target.value) {
                            e.target.value = noSpaces;
                            setValue("phoneNumber", noSpaces, {
                              shouldValidate: true,
                            });
                          }
                        },
                        onBlur: (e) => {
                          setValue(
                            "phoneNumber",
                            removeWhitespace(e.target.value),
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
                        {t("contactNumberHint")}
                      </p>
                    )}
                  </div>
                </div>

                {/* District + City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* District */}
                  <div className={fieldWrapper}>
                    <Label className="text-sm" htmlFor="district">
                      {t("district")} <span className="text-red-500">*</span>
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
                          placeholder={t("selectYourDistrict")}
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
                      {t("city")} <span className="text-red-500">*</span>
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
                          searchCityPlaceholder={t("searchCity")}
                          selectDistrictFirstPlaceholder={t(
                            "selectDistrictFirst",
                          )}
                          didYouMeanText={t("didYouMean")}
                          noCityFoundText={t("noCityFound")}
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
                  className={primaryActionButtonClassName}
                >
                  {t("next")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ── STEP 2: Tutor Details ── */}
          <TabsContent value="tutorDetails">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  {t("tutorDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Medium + Grade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Medium */}
                  <div className={fieldWrapper}>
                    <Label className="text-sm" htmlFor="medium">
                      {t("medium")} <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="medium"
                      control={control}
                      render={({ field }) => (
                        <MultiSelect
                          options={mediumOptions}
                          defaultSelected={field.value ? [field.value] : []}
                          onChange={(selected) => field.onChange(selected[0] ?? "")}
                          hasError={!!errors.medium}
                          singleSelect
                          placeholder={t("mediumPlaceholder")}
                        />
                      )}
                    />
                    {errors.medium?.message && (
                      <p className={errorMsg}>{errors.medium.message}</p>
                    )}
                  </div>

                  {/* Grade */}
                  <div className={fieldWrapper}>
                    <Label className="text-sm" htmlFor="grade">
                      {t("grade")} <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="grade"
                      control={control}
                      render={({ field }) => (
                        <MultiSelect
                          options={gradeOptions}
                          defaultSelected={field.value ? [field.value] : []}
                          onChange={(selected) => field.onChange(selected[0] ?? "")}
                          hasError={!!errors.grade}
                          singleSelect
                          placeholder={t("gradePlaceholder")}
                        />
                      )}
                    />
                    {errors.grade?.message && (
                      <p className={errorMsg}>{errors.grade.message}</p>
                    )}
                  </div>
                </div>

                {/* Number of Tutors */}
                <div className={fieldWrapper}>
                  <Label className="text-sm" htmlFor="tutorCount">
                    {t("numberOfTutors")}
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
                        {n} {n === 1 ? t("tutor") : t("tutors")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Per-tutor fields */}
                {tutors.map((_tutor, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-md flex flex-col gap-4"
                  >
                    <h3 className="text-base font-semibold">
                      {t("tutorNumber", { n: index + 1 })}
                    </h3>

                    {/* Subject */}
                    <div className={fieldWrapper}>
                      <Label className="text-sm" htmlFor={`subject-${index}`}>
                        {t("subject")} <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`tutors.${index}.subject`}
                        control={control}
                        render={({ field }) => (
                          <MultiSelect
                            options={subjectOptions}
                            defaultSelected={field.value ? [field.value] : []}
                            onChange={(selected) => field.onChange(selected[0] ?? "")}
                            hasError={!!errors.tutors?.[index]?.subject}
                            singleSelect
                            disabled={!selectedGradeId}
                            placeholder={selectedGradeId ? t("subjectPlaceholder") : t("selectGradeFirst")}
                          />
                        )}
                      />
                      {errors.tutors?.[index]?.subject?.message && (
                        <p className={errorMsg}>
                          {errors.tutors?.[index]?.subject?.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Duration */}
                      <div className={fieldWrapper}>
                        <Label
                          className="text-sm"
                          htmlFor={`duration-${index}`}
                        >
                          {t("duration")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          name={`tutors.${index}.duration`}
                          control={control}
                          render={({ field }) => (
                            <MultiSelect
                              options={durationOptions}
                              defaultSelected={field.value ? [field.value] : []}
                              onChange={(selected) => field.onChange(selected[0] ?? "")}
                              hasError={!!errors.tutors?.[index]?.duration}
                              singleSelect
                              placeholder={t("durationPlaceholder")}
                            />
                          )}
                        />
                        {errors.tutors?.[index]?.duration?.message && (
                          <p className={errorMsg}>
                            {errors.tutors?.[index]?.duration?.message}
                          </p>
                        )}
                      </div>

                      {/* Frequency */}
                      <div className={fieldWrapper}>
                        <Label
                          className="text-sm"
                          htmlFor={`frequency-${index}`}
                        >
                          {t("frequency")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          name={`tutors.${index}.frequency`}
                          control={control}
                          render={({ field }) => (
                            <MultiSelect
                              options={frequencyOptions}
                              defaultSelected={field.value ? [field.value] : []}
                              onChange={(selected) => field.onChange(selected[0] ?? "")}
                              hasError={!!errors.tutors?.[index]?.frequency}
                              singleSelect
                              placeholder={t("frequencyPlaceholder")}
                            />
                          )}
                        />
                        {errors.tutors?.[index]?.frequency?.message && (
                          <p className={errorMsg}>
                            {errors.tutors?.[index]?.frequency?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Preferred Tutor Type + Preferred Class Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={fieldWrapper}>
                        <Label
                          className="text-sm"
                          htmlFor={`tutorType-${index}`}
                        >
                          {t("preferredTutorType")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          name={`tutors.${index}.preferredTutorType`}
                          control={control}
                          render={({ field }) => (
                            <MultiSelect
                              options={tutorTypeOptions}
                              defaultSelected={field.value ? [field.value] : []}
                              onChange={(selected) => field.onChange(selected[0] ?? "")}
                              hasError={!!errors.tutors?.[index]?.preferredTutorType}
                              singleSelect
                              placeholder={t("preferredTutorTypePlaceholder")}
                            />
                          )}
                        />
                        {errors.tutors?.[index]?.preferredTutorType?.message && (
                          <p className={errorMsg}>
                            {errors.tutors?.[index]?.preferredTutorType?.message}
                          </p>
                        )}
                      </div>

                      <div className={fieldWrapper}>
                        <Label
                          className="text-sm"
                          htmlFor={`classType-${index}`}
                        >
                          {t("preferredClassType")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          name={`tutors.${index}.preferredClassType`}
                          control={control}
                          render={({ field }) => (
                            <MultiSelect
                              options={classTypeOptions}
                              defaultSelected={field.value ? [field.value] : []}
                              onChange={(selected) => field.onChange(selected[0] ?? "")}
                              hasError={!!errors.tutors?.[index]?.preferredClassType}
                              singleSelect
                              placeholder={t("preferredClassTypePlaceholder")}
                            />
                          )}
                        />
                        {errors.tutors?.[index]?.preferredClassType?.message && (
                          <p className={errorMsg}>
                            {errors.tutors?.[index]?.preferredClassType?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  {t("previous")}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={primaryActionButtonClassName}
                >
                  {isLoading ? t("submitting") : t("submit")}
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
              {t("successTitle")}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {t("successDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleSuccessClose}
            >
              {t("submitAnother")}
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
              {t("errorTitle")}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {t("errorDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center mt-2">
            <Button onClick={() => setSubmissionResult(null)}>
              {t("tryAgain")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
