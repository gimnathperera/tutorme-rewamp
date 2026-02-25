"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Shared style tokens for the register-tutor form */
const fieldWrapper = "flex flex-col gap-1";
const inputClass = "h-11";
const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring";
const selectBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";

const PersonalInfo = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const dateOfBirth = watch("dateOfBirth");

  useEffect(() => {
    if (!dateOfBirth) return;

    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age >= 0) {
      setValue("age", age, { shouldValidate: true });
    }
  }, [dateOfBirth, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Full Name */}
      <div className={fieldWrapper}>
        <Label>Full Name *</Label>
        <Input
          {...register("fullName")}
          placeholder="Full Name"
          className={`${inputClass} ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
        />
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.fullName?.message as string}
        </p>
      </div>

      {/* Email */}
      <div className={fieldWrapper}>
        <Label>Email *</Label>
        <Input
          {...register("email")}
          placeholder="Email"
          className={`${inputClass} ${errors.email ? "border-red-500" : "border-gray-300"}`}
        />
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.email?.message as string}
        </p>
      </div>

      {/* Contact Number */}
      <div className={fieldWrapper}>
        <Label>Contact Number *</Label>
        <Input
          {...register("contactNumber")}
          placeholder="Contact Number"
          className={`${inputClass} ${errors.contactNumber ? "border-red-500" : "border-gray-300"}`}
        />
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.contactNumber?.message as string}
        </p>
      </div>

      {/* Date of Birth */}
      <div className={fieldWrapper}>
        <Label>Date of Birth *</Label>
        <Input
          type="date"
          {...register("dateOfBirth")}
          className={`${inputClass} ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"}`}
        />
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.dateOfBirth?.message as string}
        </p>
      </div>

      {/* Age */}
      <div className={fieldWrapper}>
        <Label>Age *</Label>
        <Input
          type="number"
          {...register("age", { valueAsNumber: true })}
          disabled
          placeholder="Age"
          className={`${inputClass} bg-muted border-gray-300`}
        />
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.age?.message as string}
        </p>
      </div>

      {/* Gender */}
      <div className={fieldWrapper}>
        <Label>Gender *</Label>
        <select
          {...register("gender")}
          className={`${selectClass} ${selectBorder(!!errors.gender)}`}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.gender?.message as string}
        </p>
      </div>

      {/* Nationality */}
      <div className={fieldWrapper}>
        <Label>Nationality *</Label>
        <select
          {...register("nationality")}
          className={`${selectClass} ${selectBorder(!!errors.nationality)}`}
        >
          <option value="">Select</option>
          <option value="Sri Lankan">Sri Lankan</option>
          <option value="Others">Others</option>
        </select>
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.nationality?.message as string}
        </p>
      </div>

      {/* Race */}
      <div className={fieldWrapper}>
        <Label>Race *</Label>
        <select
          {...register("race")}
          className={`${selectClass} ${selectBorder(!!errors.race)}`}
        >
          <option value="">Select</option>
          <option value="Sinhalese">Sinhalese</option>
          <option value="Tamil">Tamil</option>
          <option value="Muslim">Muslim</option>
          <option value="Burgher">Burgher</option>
          <option value="Others">Others</option>
        </select>
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.race?.message as string}
        </p>
      </div>
    </div>
  );
};

export default PersonalInfo;
