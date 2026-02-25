"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import MultiFileUploadDropzone from "@/components/upload/multi-file-upload-dropzone";

const TermsAndSubmit = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Certificates Upload */}
      <div>
        <Label className="mb-2 block">Certificates *</Label>
        <Controller
          name="certificatesAndQualifications"
          control={control}
          render={({ field }) => (
            <MultiFileUploadDropzone
              initialUrls={field.value}
              onUploaded={(urls) => {
                field.onChange(urls ?? []);
              }}
            />
          )}
        />
        <p className="text-sm text-red-500 min-h-[1.25rem] mt-1">
          {errors.certificatesAndQualifications?.message
            ? String(errors.certificatesAndQualifications.message)
            : ""}
        </p>
      </div>

      {/* Agreements */}
      <div className="space-y-4">
        {/* Agree Terms */}
        <div className="flex items-start gap-3">
          <Controller
            name="agreeTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id="agreeTerms"
              />
            )}
          />
          <Label htmlFor="agreeTerms" className="flex flex-col gap-1">
            <span>I agree to the Terms and Conditions *</span>
            <span className="text-sm text-muted-foreground">
              I agree to receiving assignment information via SMS and understand
              that rates are subject to negotiation. Admin fees may apply for
              successful assignments.
            </span>
          </Label>
        </div>
        <p className="text-sm text-red-500 min-h-[1.25rem] ml-7">
          {errors.agreeTerms?.message as string}
        </p>

        {/* Agree Assignment Info */}
        <div className="flex items-start gap-3">
          <Controller
            name="agreeAssignmentInfo"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id="agreeAssignmentInfo"
              />
            )}
          />
          <Label htmlFor="agreeAssignmentInfo" className="flex flex-col gap-1">
            <span>
              I agree to receiving assignment information regarding new Tuition
              Assignments *
            </span>
            <span className="text-sm text-muted-foreground">
              By checking this box, you agree to receive SMS and email
              notifications about new tutoring assignments that match your
              preferences.
            </span>
          </Label>
        </div>
        <p className="text-sm text-red-500 min-h-[1.25rem] ml-7">
          {errors.agreeAssignmentInfo?.message as string}
        </p>
      </div>
    </div>
  );
};

export default TermsAndSubmit;
