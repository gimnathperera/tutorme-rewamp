"use client";

import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

import MultiFileUploadDropzone from "@/components/upload/multi-file-upload-dropzone";
import {
  EDUCATIONAL_DOCUMENT_OPTIONS,
  OPTIONAL_DOCUMENT_OPTIONS,
} from "@/configs/options";

const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring";
const selectBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";
const selectColor = (value: string) =>
  value ? "text-gray-900" : "text-gray-500";

const DocumentRow = ({
  fieldName,
  index,
  options,
  control,
  errors,
  onRemove,
  removable,
}: {
  fieldName: string;
  index: number;
  options: { value: string; text: string }[];
  control: any;
  errors: any;
  onRemove: () => void;
  removable: boolean;
}) => {
  const rowErrors = errors[index] ?? {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-start p-3 rounded-lg border border-gray-200 bg-gray-50">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium mb-1">
          Document Type
        </span>
        <Controller
          name={`${fieldName}.${index}.type`}
          control={control}
          render={({ field: f }) => (
            <select
              {...f}
              className={`${selectClass} ${selectBorder(!!rowErrors.type)} ${selectColor(f.value)}`}
            >
              <option value="" disabled hidden>
                Select type…
              </option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-gray-900">
                  {opt.text}
                </option>
              ))}
            </select>
          )}
        />
        {rowErrors.type && (
          <p className="text-xs text-red-500">{rowErrors.type.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
        <span className="text-xs text-gray-500 font-medium mb-1">
          Upload File
        </span>
        <Controller
          name={`${fieldName}.${index}.url`}
          control={control}
          render={({ field: f }) => (
            <MultiFileUploadDropzone
              initialUrls={f.value ? [f.value] : []}
              onUploaded={(urls) => {
                f.onChange(urls[urls.length - 1] ?? "");
              }}
            />
          )}
        />
        {rowErrors.url && (
          <p className="text-xs text-red-500">{rowErrors.url.message}</p>
        )}
      </div>

      <div className="flex items-start pt-7">
        <button
          type="button"
          onClick={onRemove}
          disabled={!removable}
          className="p-2 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Remove this document"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const TermsAndSubmit = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "certificatesAndQualifications",
  });

  const {
    fields: optFields,
    append: appendOpt,
    remove: removeOpt,
  } = useFieldArray({
    control,
    name: "optionalCertificates",
  });

  const certErrors = (errors.certificatesAndQualifications as any) ?? [];

  return (
    <div className="space-y-5">
      {/* ── Certificates & Documents ── */}
      <div className="rounded-xl border border-bggrey overflow-hidden">
        <div className="px-5 py-3 border-b border-bggrey bg-lightwhite flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-sm font-semibold text-black">
            Certificates &amp; Documents <span className="text-red-500">*</span>
          </h3>
        </div>

        <div className="p-5 space-y-5">
          {/* Educational Details — mandatory */}
          <div>
            <p className="text-xs font-semibold text-darkgrey mb-2">
              Educational Details <span className="text-red-500">*</span>
            </p>
            <div className="space-y-3">
              {eduFields.map((field, index) => (
                <DocumentRow
                  key={field.id}
                  fieldName="certificatesAndQualifications"
                  index={index}
                  options={EDUCATIONAL_DOCUMENT_OPTIONS}
                  control={control}
                  errors={certErrors}
                  onRemove={() => removeEdu(index)}
                  removable={eduFields.length > 1}
                />
              ))}
            </div>

            {typeof errors.certificatesAndQualifications?.message === "string" && (
              <p className="text-xs text-red-500 mt-1">
                {errors.certificatesAndQualifications.message}
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 flex items-center gap-1.5"
              onClick={() => appendEdu({ type: "", url: "" })}
            >
              <Plus size={15} />
              Add Document
            </Button>
          </div>

          <hr className="border-bggrey" />

          {/* Optional Details */}
          <div>
            <p className="text-xs font-semibold text-darkgrey mb-2">
              Optional Details
            </p>
            <div className="space-y-3">
              {optFields.map((field, index) => (
                <DocumentRow
                  key={field.id}
                  fieldName="optionalCertificates"
                  index={index}
                  options={OPTIONAL_DOCUMENT_OPTIONS}
                  control={control}
                  errors={[]}
                  onRemove={() => removeOpt(index)}
                  removable={true}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 flex items-center gap-1.5"
              onClick={() => appendOpt({ type: "", url: "" })}
            >
              <Plus size={15} />
              Add Document
            </Button>
          </div>
        </div>
      </div>

      {/* ── Agreements ── */}
      <div className="rounded-xl border border-bggrey overflow-hidden">
        <div className="px-5 py-3 border-b border-bggrey bg-lightwhite flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-black">Agreements</h3>
        </div>

        <div className="p-5 space-y-1">
          <div className="flex items-start gap-3">
            <Controller
              name="agreeTerms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="agreeTerms"
                  className="mt-0.5"
                />
              )}
            />
            <Label htmlFor="agreeTerms" className="flex flex-col gap-1 text-sm cursor-pointer">
              <span className="font-semibold">
                I agree to the{" "}
                <span className="text-primary-600">Terms and Conditions</span>
                {" "}<span className="text-red-500">*</span>
              </span>
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to receiving assignment information via SMS and understand
                that rates are subject to negotiation. Admin fees may apply for
                successful assignments.
              </span>
            </Label>
          </div>
          <p className="text-xs text-red-500 min-h-4 ml-7">
            {errors.agreeTerms?.message as string}
          </p>


          <div className="flex items-start gap-3 pt-1">
            <Controller
              name="agreeAssignmentInfo"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="agreeAssignmentInfo"
                  className="mt-0.5"
                />
              )}
            />
            <Label
              htmlFor="agreeAssignmentInfo"
              className="flex flex-col gap-1 text-sm cursor-pointer"
            >
              <span className="font-semibold">
                I agree to receiving assignment information regarding new Tuition
                Assignments <span className="text-red-500">*</span>
              </span>
              <span className="text-xs text-muted-foreground leading-relaxed">
                By checking this box, you agree to receive SMS and email
                notifications about new tutoring assignments that match your
                preferences.
              </span>
            </Label>
          </div>
          <p className="text-xs text-red-500 min-h-4 ml-7">
            {errors.agreeAssignmentInfo?.message as string}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndSubmit;
