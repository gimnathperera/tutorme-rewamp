"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { step1Schema, step2Schema, step3Schema, fullSchema } from "./schema";
import MultiSelect from "@/components/shared/MultiSelect";
import MultiFileUploadDropzone from "@/components/MultiFileUploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFetchGradesQuery } from "@/store/api/splits/grades";
import { useAddTutorRequestMutation } from "@/store/api/splits/tutor-request";
import { getErrorInApiResult } from "@/utils/api";
import {
  GENDER_OPTIONS,
  HIGHEST_EDUCATION_LEVELS,
  MEDIUM_OPTIONS,
  NATIONALITY_OPTIONS,
  PREFFERED_LOCATION_OPTIONS,
  RACE_OPTIONS,
  TUTOR_TYPE_OPTIONS,
  TUTORING_LEVEL_OPTIONS,
} from "@/types/register-tutor-types";

export default function FindMyTutorForm() {
  const [step, setStep] = useState(1);

  const { data: gradeData } = useFetchGradesQuery({ page: 1, limit: 50 });
  const [addTutorRequest, { isLoading }] = useAddTutorRequestMutation();

  const methods = useForm({
    resolver: zodResolver(fullSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      highestEducation: "",
      tutorType: "",
      gender: "",
      nationality: "",
      race: "",
      yearsExperience: 1,
      tutoringLevels: [],
      preferredLocations: [],
      email: "",
      contactNumber: "",
      dateOfBirth: "",
      age: 0,
      tutorMediums: [],
      grades: [],
      subjects: [],
      teachingSummary: "",
      studentResults: "",
      sellingPoints: "",
      academicDetails: "",
      certificatesAndQualifications: [],
      agreeTerms: false,
      agreeAssignmentInfo: false,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = methods;

  const selectedGradeId = watch("grades")[0];
  const subjectOptions =
    gradeData?.results
      .find((g: any) => g.id === selectedGradeId)
      ?.subjects.map((s: any) => ({ value: s.id, text: s.title })) || [];

  const nextStep = async () => {
    let fieldsToValidate: string[] = [];

    if (step === 1) fieldsToValidate = Object.keys(step1Schema.shape);
    if (step === 2) fieldsToValidate = Object.keys(step2Schema.shape);
    if (step === 3) fieldsToValidate = Object.keys(step3Schema.shape);

    const valid = await trigger(fieldsToValidate as any);
    if (!valid) return;

    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: any) => {
    try {
      const result = await addTutorRequest(data);
      const error = getErrorInApiResult(result);
      if (error) return toast.error(error);

      toast.success("Tutor profile submitted successfully!");
      reset();
      setStep(1);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div
        className="mx-auto max-w-7xl my-10 px-6 lg:px-8"
        style={{ display: step === 1 ? "block" : "none" }}
      >
        <div className="text-2xl flex flex-row gap-2 items-center px-6 font-bold mb-6  bg-gradient-to-r from-blue-500 to-indigo-600  text-white py-3 rounded">
          <h1>Register As A Tutor - Personal Information</h1>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-row gap-5 md:flex-row">
            <div className="w-full">
              <Label>Full Name *</Label>
              <Input
                className="border-gray-300 hover:border-blue"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="w-full">
              <Label>Email *</Label>
              <Input
                className="border-gray-300 hover:border-blue"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-5 md:flex-row">
            <div className="w-full">
              <Label>Contact Number *</Label>
              <Input
                className="border-gray-300 hover:border-blue"
                {...register("contactNumber")}
              />
              {errors.contactNumber && (
                <p className="text-red-500">{errors.contactNumber.message}</p>
              )}
            </div>
            <div className="w-full">
              <Label>Date of Birth *</Label>
              <Input
                className="border-gray-300 hover:border-blue"
                type="date"
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-5 md:flex-row">
            <div className="w-full">
              <Label>Age *</Label>
              <Input
                className="border-gray-300 hover:border-blue"
                type="number"
                {...register("age", { valueAsNumber: true })}
              />
              {errors.age && (
                <p className="text-red-500">{errors.age.message}</p>
              )}
            </div>
            <div className="w-full">
              <Label>Gender *</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <MultiSelect
                    options={GENDER_OPTIONS}
                    defaultSelected={field.value ? [field.value] : []}
                    onChange={(val) => field.onChange(val[0] || "")}
                    label=""
                  />
                )}
              />
              {errors.gender && (
                <p className="text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-5 md:flex-row">
            <div className="w-full">
              <Label>Nationality *</Label>
              <Controller
                control={control}
                name="nationality"
                render={({ field }) => (
                  <MultiSelect
                    options={NATIONALITY_OPTIONS}
                    defaultSelected={field.value ? [field.value] : []}
                    onChange={(val) => field.onChange(val[0] || "")}
                    label=""
                  />
                )}
              />
              {errors.nationality && (
                <p className="text-red-500">{errors.nationality.message}</p>
              )}
            </div>

            <div className="w-full">
              <Label>Race *</Label>
              <Controller
                control={control}
                name="race"
                render={({ field }) => (
                  <MultiSelect
                    options={RACE_OPTIONS}
                    defaultSelected={field.value ? [field.value] : []}
                    onChange={(val) => field.onChange(val[0] || "")}
                    label=""
                  />
                )}
              />
              {errors.race && (
                <p className="text-red-500">{errors.race.message}</p>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={nextStep}
          className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-gray-200 text-darkpurple hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Step 2 */}
      <div
        style={{ display: step === 2 ? "block" : "none" }}
        className="mx-auto max-w-7xl my-10 px-6 lg:px-8"
      >
        <div className="text-2xl flex flex-row gap-2 items-center px-6 font-bold mb-6  bg-gradient-to-r from-blue-500 to-indigo-600  text-white py-3 rounded">
          <h1>Register As A Tutor - Teaching Preferences & Qualifications</h1>
        </div>
        <div className="grid gap-6 bg-white p-5">
          <div>
            <div className="flex flex-row gap-5 md:flex-row">
              {/* Tutoring Levels */}
              <div className="w-full">
                <Label>Tutoring Levels *</Label>
                <Controller
                  control={control}
                  name="tutoringLevels"
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
                  <p className="text-red-500">
                    {errors.tutoringLevels.message}
                  </p>
                )}
              </div>

              {/* Preferred Locations */}
              <div className="w-full">
                <Label>Preferred Locations *</Label>
                <Controller
                  control={control}
                  name="preferredLocations"
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
                  <p className="text-red-500">
                    {errors.preferredLocations.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-5 md:flex-row">
              <div className="w-full">
                <Label>Tutor Type *</Label>
                <Controller
                  control={control}
                  name="tutorType"
                  render={({ field }) => (
                    <MultiSelect
                      options={TUTOR_TYPE_OPTIONS}
                      defaultSelected={field.value ? [field.value] : []}
                      onChange={(val) => field.onChange(val[0] || "")}
                      label=""
                    />
                  )}
                />
                {errors.tutorType && (
                  <p className="text-red-500">{errors.tutorType.message}</p>
                )}
              </div>

              <div className="w-full">
                <Label>Register As A Tutor - Highest Education Level *</Label>
                <Controller
                  control={control}
                  name="highestEducation"
                  render={({ field }) => (
                    <MultiSelect
                      options={HIGHEST_EDUCATION_LEVELS}
                      defaultSelected={field.value ? [field.value] : []}
                      onChange={(val) => field.onChange(val[0] || "")}
                      label=""
                    />
                  )}
                />
                {errors.highestEducation && (
                  <p className="text-red-500">
                    {errors.highestEducation.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-5 ">
              <div className="w-full">
                <Label>Years of Experience *</Label>
                <Input
                  type="number"
                  className="border-gray-300 hover:border-blue"
                  {...register("yearsExperience", { valueAsNumber: true })}
                />
                {errors.yearsExperience && (
                  <p className="text-red-500">
                    {errors.yearsExperience.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Label>Tutor Mediums *</Label>
                <Controller
                  control={control}
                  name="tutorMediums"
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
                  <p className="text-red-500">{errors.tutorMediums.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-5">
              <div className="w-full">
                <Label>Grades *</Label>
                <Controller
                  control={control}
                  name="grades"
                  render={({ field }) => (
                    <MultiSelect
                      options={
                        gradeData?.results.map((g: any) => ({
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
                  <p className="text-red-500">{errors.grades.message}</p>
                )}
              </div>
              <div className="w-full">
                <Label>Subjects *</Label>
                <Controller
                  control={control}
                  name="subjects"
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
                  <p className="text-red-500">{errors.subjects.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-gray-200 text-darkpurple hover:bg-gray-300"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-gray-200 text-darkpurple hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div
        className="mx-auto max-w-7xl my-10 px-6 lg:px-8"
        style={{ display: step === 3 ? "block" : "none" }}
      >
        <div className="text-2xl flex flex-row gap-2 items-center px-6 font-bold mb-6  bg-gradient-to-r from-blue-500 to-indigo-600  text-white py-3 rounded">
          <h1>Register As A Tutor - Teaching Profile</h1>
        </div>
        <div className="grid gap-1 bg-white p-5">
          <div>
            <Label>Short Introduction About Yourself *</Label>
            <textarea
              className="border-gray-300 hover:border-blue w-full border rounded p-2"
              placeholder="Personal Qualities (E.g Patient, Kind, Responsible...etc) Teaching Styles & Methodologies"
              {...register("teachingSummary")}
            />
            {errors.teachingSummary && (
              <p className="text-red-500">{errors.teachingSummary.message}</p>
            )}
          </div>
          <div>
            <Label>
              Summary of Teaching Experience & Academic Achievements *
            </Label>
            <textarea
              placeholder="Achievements & subjects taught, e.g., number of students, years, etc."
              {...register("academicDetails")}
              className="border-gray-300 hover:border-blue w-full border rounded p-2"
            />
            {errors.academicDetails && (
              <p className="text-red-500">{errors.academicDetails.message}</p>
            )}
          </div>
          <div>
            <Label>Results of Students / Track Record *</Label>
            <textarea
              placeholder="Past grade improvement records of previous students."
              {...register("studentResults")}
              className="border-gray-300 hover:border-blue w-full border rounded p-2"
            />
            {errors.studentResults && (
              <p className="text-red-500">{errors.studentResults.message}</p>
            )}
          </div>
          <div>
            <Label>Other Selling Points as a Tutor *</Label>
            <textarea
              placeholder="Teaching methods, commitments, what makes you stand out."
              {...register("sellingPoints")}
              className="border-gray-300 hover:border-blue w-full border rounded p-2"
            />
            {errors.sellingPoints && (
              <p className="text-red-500">{errors.sellingPoints.message}</p>
            )}
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-gray-200 text-darkpurple hover:bg-gray-300"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-gray-200 text-darkpurple hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div
        className="mx-auto max-w-7xl my-10 px-6 lg:px-8"
        style={{ display: step === 4 ? "block" : "none" }}
      >
        <div className="text-2xl flex flex-row gap-2 items-center px-6 font-bold mb-6  bg-gradient-to-r from-blue-500 to-indigo-600  text-white py-3 rounded">
          {/* <Image height={50} width={50} src={LogoImage} alt="Logo image" /> */}
          <h1>Verification & Agreement</h1>
        </div>
        <div className="grid gap-2 bg-white p-5">
          <div>
            <Label>Certificates *</Label>
            <Controller
              control={control}
              name="certificatesAndQualifications"
              render={({ field }) => (
                <MultiFileUploadDropzone
                  onUploaded={(urls) => field.onChange(urls)}
                />
              )}
            />
            {errors.certificatesAndQualifications && (
              <p className="text-red-500">
                {errors.certificatesAndQualifications.message}
              </p>
            )}
          </div>
          <div className="flex flex-row gap-2">
            <input
              type="checkbox"
              {...register("agreeTerms")}
              id="agreeTerms"
            />
            <Label htmlFor="agreeTerms" className="flex flex-col gap-2">
              I agree to the Terms and Conditions
              <span className="text-gray-500">
                (I agree to receiving assignment information via SMS and
                understand that rates are subject to negotiation. I understand
                there may be admin fees involved for successful assignments.)
              </span>
            </Label>
          </div>
          <div className="flex flex-row gap-2">
            <input
              type="checkbox"
              {...register("agreeAssignmentInfo")}
              id="agreeAssignmentInfo"
            />
            <Label
              className="flex flex-col gap-2"
              htmlFor="agreeAssignmentInfo"
            >
              I Agree to receiving assignment information regarding new Tuition
              Assignments
              <span className="text-gray-500">
                (By checking this box, you agree to receive SMS and email
                notifications about new tutoring assignments that match your
                preferences.)
              </span>
            </Label>
          </div>
          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={prevStep}
              className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-gray-200 text-darkpurple hover:bg-gray-300"
            >
              Previous
            </button>
            <button
              type="submit"
              className="text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
