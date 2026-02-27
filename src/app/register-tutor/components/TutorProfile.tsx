"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** Shared style tokens – keep in sync with other register-tutor components */
const fieldWrapper = "flex flex-col gap-1";
const textareaBase = "w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y";
const textareaBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";

const CHAR_LIMIT = 500;

/** Character counter shown below each textarea */
const CharCounter = ({ value }: { value: string }) => {
  const count = (value ?? "").length;
  const near = count > CHAR_LIMIT * 0.85;
  return (
    <span className={`text-xs tabular-nums ${near ? "text-orange-500 font-medium" : "text-muted-foreground"}`}>
      {count} / {CHAR_LIMIT}
    </span>
  );
};

const TutorProfile = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const teachingSummary = watch("teachingSummary") ?? "";
  const academicDetails = watch("academicDetails") ?? "";
  const studentResults = watch("studentResults") ?? "";
  const sellingPoints = watch("sellingPoints") ?? "";

  return (
    <div className="space-y-6">
      {/* Teaching Summary */}
      <div className={fieldWrapper}>
        <Label htmlFor="teachingSummary" className="mb-1 block">
          Short Introduction About Yourself *
        </Label>
        <Textarea
          id="teachingSummary"
          className={`${textareaBase} ${textareaBorder(!!errors.teachingSummary)}`}
          {...register("teachingSummary")}
          placeholder="Personal qualities, teaching styles & methodologies"
          rows={4}
          maxLength={CHAR_LIMIT}
        />
        <div className="flex items-center justify-between min-h-[1.25rem]">
          <p className="text-sm text-red-500">
            {errors.teachingSummary?.message as string}
          </p>
          <CharCounter value={teachingSummary} />
        </div>
      </div>

      {/* Academic Details */}
      <div className={fieldWrapper}>
        <Label htmlFor="academicDetails" className="mb-1 block">
          Summary of Teaching Experience &amp; Academic Achievements *
        </Label>
        <Textarea
          id="academicDetails"
          className={`${textareaBase} ${textareaBorder(!!errors.academicDetails)}`}
          {...register("academicDetails")}
          placeholder="Achievements & subjects taught (e.g. number of students, years, results)"
          rows={4}
          maxLength={CHAR_LIMIT}
        />
        <div className="flex items-center justify-between min-h-[1.25rem]">
          <p className="text-sm text-red-500">
            {errors.academicDetails?.message as string}
          </p>
          <CharCounter value={academicDetails} />
        </div>
      </div>

      {/* Student Results */}
      <div className={fieldWrapper}>
        <Label htmlFor="studentResults" className="mb-1 block">
          Results of Students / Track Record *
        </Label>
        <Textarea
          id="studentResults"
          className={`${textareaBase} ${textareaBorder(!!errors.studentResults)}`}
          {...register("studentResults")}
          placeholder="Past student results, grade improvements, examination outcomes"
          rows={4}
          maxLength={CHAR_LIMIT}
        />
        <div className="flex items-center justify-between min-h-[1.25rem]">
          <p className="text-sm text-red-500">
            {errors.studentResults?.message as string}
          </p>
          <CharCounter value={studentResults} />
        </div>
      </div>

      {/* Selling Points */}
      <div className={fieldWrapper}>
        <Label htmlFor="sellingPoints" className="mb-1 block">
          Other Selling Points as a Tutor *
        </Label>
        <Textarea
          id="sellingPoints"
          className={`${textareaBase} ${textareaBorder(!!errors.sellingPoints)}`}
          {...register("sellingPoints")}
          placeholder="Teaching methods, commitment level, what makes you stand out"
          rows={4}
          maxLength={CHAR_LIMIT}
        />
        <div className="flex items-center justify-between min-h-[1.25rem]">
          <p className="text-sm text-red-500">
            {errors.sellingPoints?.message as string}
          </p>
          <CharCounter value={sellingPoints} />
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
