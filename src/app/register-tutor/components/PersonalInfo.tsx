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

/** Hint text shown below a field while it has no error */
const Hint = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-muted-foreground min-h-[1.25rem]">{children}</p>
);

const PersonalInfo = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext();

  const dateOfBirth = watch("dateOfBirth");

  /** Latest selectable date = today minus 18 years (tutor must be ≥ 18) */
  const maxDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
  })();

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
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          {...register("fullName")}
          placeholder="e.g. Nimal Perera"
          autoComplete="name"
          className={`${inputClass} ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.fullName ? (
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.fullName?.message as string}
          </p>
        ) : (
          <Hint>Letters and spaces only</Hint>
        )}
      </div>

      {/* Email */}
      <div className={fieldWrapper}>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="e.g. nimal@example.com"
          autoComplete="email"
          className={`${inputClass} ${errors.email ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.email ? (
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.email?.message as string}
          </p>
        ) : (
          <Hint>Enter a valid email address</Hint>
        )}
      </div>

      {/* Contact Number */}
      <div className={fieldWrapper}>
        <Label htmlFor="contactNumber">Contact Number *</Label>
        <Input
          id="contactNumber"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          {...register("contactNumber")}
          placeholder="e.g. 0771234567"
          autoComplete="tel"
          className={`${inputClass} ${errors.contactNumber ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.contactNumber ? (
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.contactNumber?.message as string}
          </p>
        ) : (
          <Hint>10-digit mobile number (digits only)</Hint>
        )}
      </div>

      {/* Gender */}
      <div className={fieldWrapper}>
        <Label htmlFor="gender">Gender *</Label>
        <select
          id="gender"
          {...register("gender")}
          autoComplete="sex"
          className={`${selectClass} ${selectBorder(!!errors.gender)}`}
        >
          <option value="" disabled hidden>Select your gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.gender?.message as string}
        </p>
      </div>

      {/* Date of Birth */}
      <div className={fieldWrapper}>
        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
        <Input
          id="dateOfBirth"
          type="date"
          {...register("dateOfBirth")}
          max={maxDate}
          autoComplete="bday"
          className={`${inputClass} ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.dateOfBirth ? (
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.dateOfBirth?.message as string}
          </p>
        ) : (
          <Hint>You must be at least 18 years old</Hint>
        )}
      </div>

      {/* Age — auto-calculated */}
      <div className={fieldWrapper}>
        <Label htmlFor="age">Age *</Label>
        <Input
          id="age"
          type="number"
          {...register("age", { valueAsNumber: true })}
          disabled
          placeholder="Auto-calculated"
          className={`${inputClass} bg-muted border-gray-300`}
        />
        {errors.age ? (
          <p className="text-sm text-red-500 min-h-[1.25rem]">
            {errors.age?.message as string}
          </p>
        ) : (
          <Hint>Calculated from your date of birth</Hint>
        )}
      </div>

      {/* Nationality */}
      <div className={fieldWrapper}>
        <Label htmlFor="nationality">Nationality *</Label>
        <select
          id="nationality"
          {...register("nationality")}
          autoComplete="country-name"
          className={`${selectClass} ${selectBorder(!!errors.nationality)}`}
        >
          <option value="" disabled hidden>Select your nationality</option>
          <option value="Sri Lankan">Sri Lankan</option>
          <option value="Others">Others</option>
        </select>
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.nationality?.message as string}
        </p>
      </div>

      {/* Race */}
      <div className={fieldWrapper}>
        <Label htmlFor="race">Race *</Label>
        <select
          id="race"
          {...register("race")}
          className={`${selectClass} ${selectBorder(!!errors.race)}`}
        >
          <option value="" disabled hidden>Select your ethnicity</option>
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
