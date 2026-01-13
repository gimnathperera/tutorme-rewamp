"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TutorProfile = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Teaching Summary */}
      <div>
        <Label className="mb-1 block">
          Short Introduction About Yourself *
        </Label>
        <Textarea
          className="border rounded border-gray-300 bg-white"
          {...register("teachingSummary")}
          placeholder="Personal qualities, teaching styles & methodologies"
          rows={4}
        />
        {errors.teachingSummary && (
          <p className="text-sm text-red-500 mt-1">
            {`${errors.teachingSummary.message}`}
          </p>
        )}
      </div>

      {/* Academic Details */}
      <div>
        <Label className="mb-1 block">
          Summary of Teaching Experience & Academic Achievements *
        </Label>
        <Textarea
          className="border rounded border-gray-300 bg-white"
          {...register("academicDetails")}
          placeholder="Achievements & subjects taught (e.g. number of students, years, results)"
          rows={4}
        />
        {errors.academicDetails && (
          <p className="text-sm text-red-500 mt-1">
            {`${errors.academicDetails.message}`}
          </p>
        )}
      </div>

      {/* Student Results */}
      <div>
        <Label className="mb-1 block">
          Results of Students / Track Record *
        </Label>
        <Textarea
          className="border rounded border-gray-300 bg-white"
          {...register("studentResults")}
          placeholder="Past student results, grade improvements, examination outcomes"
          rows={4}
        />
        {errors.studentResults && (
          <p className="text-sm text-red-500 mt-1">
            {`${errors.studentResults.message}`}
          </p>
        )}
      </div>

      {/* Selling Points */}
      <div>
        <Label className="mb-1 block">Other Selling Points as a Tutor *</Label>
        <Textarea
          className="border rounded border-gray-300 bg-white"
          {...register("sellingPoints")}
          placeholder="Teaching methods, commitment level, what makes you stand out"
          rows={4}
        />
        {errors.sellingPoints && (
          <p className="text-sm text-red-500 mt-1">
            {`${errors.sellingPoints.message}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default TutorProfile;
