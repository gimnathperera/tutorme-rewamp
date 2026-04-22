"use client";

import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

import MultiFileUploadDropzone from "@/components/upload/multi-file-upload-dropzone";

// ---------------------------------------------------------------------------
// Document type options
// ---------------------------------------------------------------------------

const DOCUMENT_TYPE_OPTIONS = [
  { value: "NIC", label: "NIC (National ID Card)" },
  { value: "Passport", label: "Passport" },
  { value: "Driving License", label: "Driving License" },
  { value: "Educational Certificate", label: "Educational Certificate" },
  { value: "Degree Certificate", label: "Degree Certificate" },
  { value: "Diploma Certificate", label: "Diploma Certificate" },
  { value: "Professional Certificate", label: "Professional Certificate" },
  { value: "Teaching Certificate", label: "Teaching Certificate" },
  { value: "Police Clearance", label: "Police Clearance Report" },
  { value: "Other", label: "Other" },
];

// ---------------------------------------------------------------------------
// Select style helpers (reuse the same token as other steps)
// ---------------------------------------------------------------------------

const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring text-gray-900";
const selectBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TermsAndSubmit = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certificatesAndQualifications",
  });

  const certErrors = (errors.certificatesAndQualifications as any) ?? [];

  return (
    <div className="space-y-6">
      {/* ── Document Uploads ── */}
      <div>
        <Label className="text-sm mb-3 block">
          Certificates &amp; Documents <span className="text-red-500">*</span>
        </Label>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const rowErrors = certErrors[index] ?? {};

            return (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-start p-4 rounded-lg border border-gray-200 bg-gray-50"
              >
                {/* Document Type Dropdown */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium mb-1">
                    Document Type
                  </span>
                  <Controller
                    name={`certificatesAndQualifications.${index}.type`}
                    control={control}
                    render={({ field: f }) => (
                      <select
                        {...f}
                        className={`${selectClass} ${selectBorder(!!rowErrors.type)}`}
                      >
                        <option value="" disabled hidden>
                          Select type…
                        </option>
                        {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {rowErrors.type && (
                    <p className="text-xs text-red-500">
                      {rowErrors.type.message}
                    </p>
                  )}
                </div>

                {/* Upload Dropzone */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium mb-1">
                    Upload File
                  </span>
                  <Controller
                    name={`certificatesAndQualifications.${index}.url`}
                    control={control}
                    render={({ field: f }) => (
                      <MultiFileUploadDropzone
                        initialUrls={f.value ? [f.value] : []}
                        onUploaded={(urls) => {
                          // Single-file per row — take the last uploaded URL
                          f.onChange(urls[urls.length - 1] ?? "");
                        }}
                      />
                    )}
                  />
                  {rowErrors.url && (
                    <p className="text-xs text-red-500">
                      {rowErrors.url.message}
                    </p>
                  )}
                </div>

                {/* Remove Row Button */}
                <div className="flex items-start pt-7">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="p-2 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Remove this document"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Root-level array error (e.g. "At least one document is required") */}
        {typeof errors.certificatesAndQualifications?.message === "string" && (
          <p className="text-xs text-red-500 mt-1">
            {errors.certificatesAndQualifications.message}
          </p>
        )}

        {/* Add Document Row */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 flex items-center gap-1.5"
          onClick={() => append({ type: "", url: "" })}
        >
          <Plus size={15} />
          Add Document
        </Button>
      </div>

      {/* ── Agreements ── */}
      <div>
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
          <Label htmlFor="agreeTerms" className="flex flex-col gap-1 text-sm">
            <span>
              I agree to the Terms and Conditions{" "}
              <span className="text-red-500">*</span>
            </span>
            <span className="text-xs text-muted-foreground">
              I agree to receiving assignment information via SMS and understand
              that rates are subject to negotiation. Admin fees may apply for
              successful assignments.
            </span>
          </Label>
        </div>
        <p className="text-xs text-red-500 min-h-[1.25rem] ml-7">
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
          <Label
            htmlFor="agreeAssignmentInfo"
            className="flex flex-col gap-1 text-sm"
          >
            <span>
              I agree to receiving assignment information regarding new Tuition
              Assignments <span className="text-red-500">*</span>
            </span>
            <span className="text-xs text-muted-foreground">
              By checking this box, you agree to receive SMS and email
              notifications about new tutoring assignments that match your
              preferences.
            </span>
          </Label>
        </div>
        <p className="text-xs text-red-500 min-h-[1.25rem] ml-7">
          {errors.agreeAssignmentInfo?.message as string}
        </p>
      </div>
    </div>
  );
};

export default TermsAndSubmit;
