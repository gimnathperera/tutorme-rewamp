"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Icon from "@/components/shared/icon";
import {
  collapseTextSpaces,
  removeWhitespace,
  stripLeadingSpaces,
} from "@/utils/form-normalizers";
import { getEmailFormatError } from "@/utils/email-validation";
import { useLazyGetTutorEmailAvailabilityQuery } from "@/store/api/splits/tutor-request";
import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  RACE_OPTIONS,
} from "@/configs/register-tutor";
import { useTranslations } from "next-intl";

/** Shared style tokens for the register-tutor form */
const fieldWrapper = "flex flex-col gap-1.5";
const inputClass = "h-11 text-sm placeholder:text-gray-500 text-gray-900";
const selectClass =
  "h-11 w-full rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring";
const selectBorder = (hasError: boolean) =>
  hasError ? "border-red-500" : "border-gray-300";
const selectColor = (value: string) =>
  value ? "text-gray-900" : "text-gray-500";
const EMAIL_CHECK_DELAY_MS = 500;

/** Hint text shown below a field while it has no error */
const Hint = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs leading-4 text-muted-foreground min-h-4">{children}</p>
);

const preventWhitespaceKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (/\s/.test(event.key)) {
    event.preventDefault();
  }
};

const formatDateInputValue = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

type EmailAvailabilityState = "available" | "unavailable" | null;

const PersonalInfo = () => {
  const t = useTranslations("registerTutor");
  const {
    register,
    watch,
    clearErrors,
    setError,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailAvailability, setEmailAvailability] =
    useState<EmailAvailabilityState>(null);
  const [checkTutorEmailAvailability, { isFetching: isCheckingEmail }] =
    useLazyGetTutorEmailAvailabilityQuery();

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const latestEmailRef = useRef("");

  const dateOfBirth = watch("dateOfBirth");
  const email = watch("email");
  const gender = watch("gender");
  const nationality = watch("nationality");
  const race = watch("race");

  /** Latest selectable date = today minus 18 years (tutor must be ≥ 18) */
  const maxDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return formatDateInputValue(d);
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

  useEffect(() => {
    const normalizedEmail =
      typeof email === "string" ? removeWhitespace(email).toLowerCase() : "";
    latestEmailRef.current = normalizedEmail;

    if (!normalizedEmail) {
      setEmailAvailability(null);
      return;
    }

    const formatError = getEmailFormatError(normalizedEmail);
    if (formatError) {
      setEmailAvailability("unavailable");
      setError("email", {
        type: "manual",
        message: formatError,
      });
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const result = await checkTutorEmailAvailability(normalizedEmail, true);
      if (latestEmailRef.current !== normalizedEmail) return;
      if (!result.data) {
        setEmailAvailability(null);
        return;
      }

      if (!result.data.available) {
        setEmailAvailability("unavailable");
        setError("email", {
          type: "server",
          message: result.data.message || "Email already exists",
        });
        return;
      }

      setEmailAvailability("available");
      if ((errors.email as { type?: string } | undefined)?.type === "server") {
        clearErrors("email");
      }
    }, EMAIL_CHECK_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [checkTutorEmailAvailability, clearErrors, email, errors.email, setError]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
      {/* Full Name */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="fullName">
          {t("fullName")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          {...register("fullName", {
            onChange: (e) => {
              const cleaned = stripLeadingSpaces(e.target.value);
              if (cleaned !== e.target.value) {
                e.target.value = cleaned;
                setValue("fullName", cleaned, { shouldValidate: true });
              }
            },
            onBlur: (e) => {
              setValue("fullName", collapseTextSpaces(e.target.value), {
                shouldValidate: true,
              });
            },
          })}
          placeholder={t("fullNamePlaceholder")}
          autoComplete="name"
          className={`${inputClass} ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.fullName ? (
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.fullName?.message as string}
          </p>
        ) : (
          <Hint>{t("fullNameHint")}</Hint>
        )}
      </div>

      {/* Email */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="email">
          {t("email")} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            onKeyDown={preventWhitespaceKey}
            {...register("email", {
              onChange: (e) => {
                const noSpaces = removeWhitespace(e.target.value);
                setEmailAvailability(null);
                if (
                  (errors.email as { type?: string } | undefined)?.type ===
                  "server"
                ) {
                  clearErrors("email");
                }
                if (noSpaces !== e.target.value) {
                  e.target.value = noSpaces;
                  setValue("email", noSpaces, { shouldValidate: true });
                }
              },
              onBlur: (e) => {
                setValue("email", removeWhitespace(e.target.value), {
                  shouldValidate: true,
                });
              },
            })}
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            className={`${inputClass} pr-10 ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            {isCheckingEmail ? (
              <Spinner className="text-gray-400" />
            ) : errors.email || emailAvailability === "unavailable" ? (
              <Icon name="CircleX" size={18} className="text-red-500" />
            ) : emailAvailability === "available" ? (
              <Icon name="CircleCheck" size={18} className="text-green-600" />
            ) : null}
          </span>
        </div>
        {errors.email ? (
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.email?.message as string}
          </p>
        ) : isCheckingEmail ? (
          <Hint>{t("emailChecking")}</Hint>
        ) : emailAvailability === "available" ? (
          <p className="text-xs leading-4 text-green-600 min-h-4">
            {t("emailAvailable")}
          </p>
        ) : (
          <Hint>{t("emailHint")}</Hint>
        )}
      </div>

      {/* Password */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="password">
          {t("password")} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            onKeyDown={preventWhitespaceKey}
            {...register("password", {
              onChange: (e) => {
                const noSpaces = removeWhitespace(e.target.value);
                if (noSpaces !== e.target.value) {
                  e.target.value = noSpaces;
                  setValue("password", noSpaces, { shouldValidate: true });
                }
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
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.password?.message as string}
          </p>
        ) : (
          <Hint>{t("passwordHint")}</Hint>
        )}
      </div>

      {/* Confirm Password */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="confirmPassword">
          {t("confirmPassword")} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            onKeyDown={preventWhitespaceKey}
            {...register("confirmPassword", {
              onChange: (e) => {
                const noSpaces = removeWhitespace(e.target.value);
                if (noSpaces !== e.target.value) {
                  e.target.value = noSpaces;
                  setValue("confirmPassword", noSpaces, {
                    shouldValidate: true,
                  });
                }
                trigger("confirmPassword");
              },
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
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.confirmPassword?.message as string}
          </p>
        ) : (
          <Hint>{t("confirmPasswordHint")}</Hint>
        )}
      </div>

      {/* Contact Number */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="contactNumber">
          {t("contactNumber")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contactNumber"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          onKeyDown={preventWhitespaceKey}
          {...register("contactNumber", {
            onChange: (e) => {
              const noSpaces = removeWhitespace(e.target.value);
              if (noSpaces !== e.target.value) {
                e.target.value = noSpaces;
                setValue("contactNumber", noSpaces, {
                  shouldValidate: true,
                });
              }
            },
            onBlur: (e) => {
              setValue("contactNumber", removeWhitespace(e.target.value), {
                shouldValidate: true,
              });
            },
          })}
          placeholder={t("contactNumberPlaceholder")}
          autoComplete="tel"
          className={`${inputClass} ${errors.contactNumber ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.contactNumber ? (
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.contactNumber?.message as string}
          </p>
        ) : (
          <Hint>{t("contactNumberHint")}</Hint>
        )}
      </div>

      {/* Gender */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="gender">
          {t("gender")} <span className="text-red-500">*</span>
        </Label>
        <select
          id="gender"
          {...register("gender")}
          autoComplete="sex"
          className={`${selectClass} ${selectBorder(!!errors.gender)} ${selectColor(gender)}`}
        >
          <option value="" disabled hidden>
            {t("genderPlaceholder")}
          </option>
          {GENDER_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-gray-900"
            >
              {option.text}
            </option>
          ))}
        </select>
        <p className="text-xs leading-4 text-red-500 min-h-4">
          {errors.gender?.message as string}
        </p>
      </div>

      {/* Date of Birth */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="dateOfBirth">
          {t("dateOfBirth")} <span className="text-red-500">*</span>
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
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.dateOfBirth?.message as string}
          </p>
        ) : (
          <Hint>{t("dateOfBirthHint")}</Hint>
        )}
      </div>

      {/* Age — auto-calculated */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="age">
          {t("age")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="age"
          type="number"
          {...register("age", { valueAsNumber: true })}
          disabled
          placeholder={t("agePlaceholder")}
          className={`${inputClass} bg-muted border-gray-300`}
        />
        {errors.age ? (
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.age?.message as string}
          </p>
        ) : (
          <Hint>{t("ageHint")}</Hint>
        )}
      </div>

      {/* Nationality */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="nationality">
          {t("nationality")} <span className="text-red-500">*</span>
        </Label>
        <select
          id="nationality"
          {...register("nationality")}
          autoComplete="country-name"
          className={`${selectClass} ${selectBorder(!!errors.nationality)} ${selectColor(nationality)}`}
        >
          <option value="" disabled hidden>
            {t("nationalityPlaceholder")}
          </option>
          {NATIONALITY_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-gray-900"
            >
              {option.text}
            </option>
          ))}
        </select>
        <p className="text-xs leading-4 text-red-500 min-h-4">
          {errors.nationality?.message as string}
        </p>
      </div>

      {/* Race */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="race">
          {t("race")} <span className="text-red-500">*</span>
        </Label>
        <select
          id="race"
          {...register("race")}
          className={`${selectClass} ${selectBorder(!!errors.race)} ${selectColor(race)}`}
        >
          <option value="" disabled hidden>
            {t("racePlaceholder")}
          </option>
          {RACE_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-gray-900"
            >
              {option.text}
            </option>
          ))}
        </select>
        <p className="text-xs leading-4 text-red-500 min-h-4">
          {errors.race?.message as string}
        </p>
      </div>
    </div>
  );
};

export default PersonalInfo;
