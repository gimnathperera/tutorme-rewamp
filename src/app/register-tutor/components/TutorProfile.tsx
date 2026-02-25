"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** Shared style tokens – keep in sync with other register-tutor components */
const fieldWrapper = "flex flex-col gap-1";
const textareaBase = "w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y";
const textareaBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";

const TutorProfile = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Teaching Summary */}
      <div className={fieldWrapper}>
        <Label className="mb-1 block">
          Short Introduction About Yourself *
        </Label>
        <Textarea
          className={`${textareaBase} ${textareaBorder(!!errors.teachingSummary)}`}
          {...register("teachingSummary")}
          placeholder="Personal qualities, teaching styles & methodologies"
          rows={4}
        />
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.teachingSummary?.message as string}
        </p>
      </div>

      {/* Academic Details */}
      <div className={fieldWrapper}>
        <Label className="mb-1 block">
          Summary of Teaching Experience & Academic Achievements *
        </Label>
        <Textarea
          className={`${textareaBase} ${textareaBorder(!!errors.academicDetails)}`}
          {...register("academicDetails")}
          placeholder="Achievements & subjects taught (e.g. number of students, years, results)"
          rows={4}
        />
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.academicDetails?.message as string}
        </p>
      </div>

      {/* Student Results */}
      <div className={fieldWrapper}>
        <Label className="mb-1 block">
          Results of Students / Track Record *
        </Label>
        <Textarea
          className={`${textareaBase} ${textareaBorder(!!errors.studentResults)}`}
          {...register("studentResults")}
          placeholder="Past student results, grade improvements, examination outcomes"
          rows={4}
        />
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.studentResults?.message as string}
        </p>
      </div>

      {/* Selling Points */}
      <div className={fieldWrapper}>
        <Label className="mb-1 block">Other Selling Points as a Tutor *</Label>
        <Textarea
          className={`${textareaBase} ${textareaBorder(!!errors.sellingPoints)}`}
          {...register("sellingPoints")}
          placeholder="Teaching methods, commitment level, what makes you stand out"
          rows={4}
        />
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.sellingPoints?.message as string}
        </p>
      </div>
    </div>
  );
};

export default TutorProfile;
