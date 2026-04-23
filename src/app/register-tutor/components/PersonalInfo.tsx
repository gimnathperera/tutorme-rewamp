"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/shared/icon";

/** Shared style tokens for the register-tutor form */
const fieldWrapper = "flex flex-col gap-2";
const inputClass = "h-11 text-sm placeholder:text-gray-500 text-gray-900";
const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring text-gray-900";
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
    trigger,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dateInputRef = useRef<HTMLInputElement | null>(null);

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
        <Label className="text-sm" htmlFor="fullName">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          {...register("fullName")}
          placeholder="e.g. Nimal Perera"
          autoComplete="name"
          className={`${inputClass} ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.fullName ? (
          <p className="text-xs text-red-500 min-h-[1.25rem]">
            {errors.fullName?.message as string}
          </p>
        ) : (
          <Hint>Letters and spaces only</Hint>
        )}
      </div>

      {/* Email */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="e.g. nimal@example.com"
          autoComplete="email"
          className={`${inputClass} ${errors.email ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.email ? (
          <p className="text-xs text-red-500 min-h-[1.25rem]">
            {errors.email?.message as string}
          </p>
        ) : (
          <Hint>Enter a valid email address</Hint>
        )}
      </div>

      {/* Password */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="password">
          Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              onChange: () => {
                trigger("password");
                // Re-validate confirmPassword so mismatch clears when password changes
                trigger("confirmPassword");
              },
            })}
            autoComplete="new-password"
            className={`${inputClass} pr-10 ${errors.password ? "border-red-500" : "border-gray-300"}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Icon name="Eye" /> : <Icon name="EyeClosed" />}
          </button>
        </div>
        {errors.password ? (
          <p className="text-xs text-red-500 min-h-[1.25rem]">
            {errors.password?.message as string}
          </p>
        ) : (
          <Hint>8–12 chars, at least one letter and one number</Hint>
        )}
      </div>

      {/* Confirm Password */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="confirmPassword">
          Confirm Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword", {
              onChange: () => trigger("confirmPassword"),
            })}
            autoComplete="new-password"
            className={`${inputClass} pr-10 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <Icon name="Eye" /> : <Icon name="EyeClosed" />}
          </button>
        </div>
        {errors.confirmPassword ? (
          <p className="text-xs text-red-500 min-h-[1.25rem]">
            {errors.confirmPassword?.message as string}
          </p>
        ) : (
          <Hint>Re-enter your password to confirm</Hint>
        )}
      </div>

      {/* Contact Number */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="contactNumber">
          Contact Number <span className="text-red-500">*</span>
        </Label>
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
          <p className="text-xs text-red-500 min-h-[1.25rem]">
            {errors.contactNumber?.message as string}
          </p>
        ) : (
          <Hint>10-digit mobile number (digits only)</Hint>
        )}
      </div>

      {/* Gender */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="gender">
          Gender <span className="text-red-500">*</span>
        </Label>
        <select
          id="gender"
          {...register("gender")}
          autoComplete="sex"
          className={`${selectClass} ${selectBorder(!!errors.gender)}`}
        >
          <option value="" disabled hidden>
            Select your gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.gender?.message as string}
        </p>
      </div>

      {/* Date of Birth */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="dateOfBirth">
          Date of Birth <span className="text-red-500">*</span>
        </Label>
        <div
          className="relative cursor-pointer"
          onClick={() => dateInputRef.current?.showPicker()}
        >
          <Input
            id="dateOfBirth"
            type="date"
            {...register("dateOfBirth")}
            ref={(el) => {
              register("dateOfBirth").ref(el);
              dateInputRef.current = el;
            }}
            onKeyDown={(e) => e.preventDefault()}
            max={maxDate}
            autoComplete="bday"
            className={`${inputClass} pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"}`}
          />
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <Icon name="Calendar" size={16} />
          </span>
        </div>
        {errors.dateOfBirth ? (
          <p className="text-xs text-red-500 min-h-[1.25rem]">
            {errors.dateOfBirth?.message as string}
          </p>
        ) : (
          <Hint>You must be at least 18 years old</Hint>
        )}
      </div>

      {/* Age — auto-calculated */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="age">
          Age <span className="text-red-500">*</span>
        </Label>
        <Input
          id="age"
          type="number"
          {...register("age", { valueAsNumber: true })}
          disabled
          placeholder="Auto-calculated"
          className={`${inputClass} bg-muted border-gray-300`}
        />
        {errors.age ? (
          <p className="text-xs text-red-500 min-h-[1.25rem]">
            {errors.age?.message as string}
          </p>
        ) : (
          <Hint>Calculated from your date of birth</Hint>
        )}
      </div>

      {/* Nationality */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="nationality">
          Nationality <span className="text-red-500">*</span>
        </Label>
        <select
          id="nationality"
          {...register("nationality")}
          autoComplete="country-name"
          className={`${selectClass} ${selectBorder(!!errors.nationality)}`}
        >
          <option value="" disabled hidden>
            Select your nationality
          </option>
          <option value="Sri Lankan">Sri Lankan</option>
          <option value="Others">Others</option>
        </select>
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.nationality?.message as string}
        </p>
      </div>

      {/* Race */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="race">
          Race <span className="text-red-500">*</span>
        </Label>
        <select
          id="race"
          {...register("race")}
          className={`${selectClass} ${selectBorder(!!errors.race)}`}
        >
          <option value="" disabled hidden>
            Select your ethnicity
          </option>
          <option value="Sinhalese">Sinhalese</option>
          <option value="Tamil">Tamil</option>
          <option value="Muslim">Muslim</option>
          <option value="Burgher">Burgher</option>
        </select>
        <p className="text-sm text-red-500 min-h-[1.25rem]">
          {errors.race?.message as string}
        </p>
      </div>
    </div>
  );
};

export default PersonalInfo;
