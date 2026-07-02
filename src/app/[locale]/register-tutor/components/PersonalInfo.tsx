"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useFormContext } from "react-hook-form";
import MultiSelect from "@/components/shared/MultiSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Icon from "@/components/shared/icon";
import InputDatePicker from "@/components/shared/input-date-picker";
import {
  collapseTextSpaces,
  removeWhitespace,
  stripLeadingSpaces,
} from "@/utils/form-normalizers";
import { getEmailFormatError } from "@/utils/email-validation";
import { isPendingEmailError } from "@/utils/tutor-registration-errors";
import {
  useLazyGetTutorEmailAvailabilityQuery,
  useLazyValidateReferralCodeQuery,
} from "@/store/api/splits/tutor-request";
import { useTranslations } from "next-intl";

/** Shared style tokens for the register-tutor form */
const fieldWrapper = "flex flex-col gap-1.5";
const inputClass = "h-11 text-sm placeholder:text-gray-500 text-gray-900";
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
type ReferralCodeState = "valid" | "invalid" | null;

const PersonalInfo = () => {
  const t = useTranslations("registerTutor");
  const searchParams = useSearchParams();
  const genderOptions = useMemo(
    () => [
      { value: "Male", text: t("optGenderMale") },
      { value: "Female", text: t("optGenderFemale") },
    ],
    [t],
  );
  const {
    register,
    control,
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
  const [referralCodeState, setReferralCodeState] =
    useState<ReferralCodeState>(null);
  const [checkTutorEmailAvailability, { isFetching: isCheckingEmail }] =
    useLazyGetTutorEmailAvailabilityQuery();
  const [validateReferralCode, { isFetching: isCheckingReferralCode }] =
    useLazyValidateReferralCodeQuery();

  const latestEmailRef = useRef("");
  const latestReferralCodeRef = useRef("");

  // Auto-fill referral code from ?referral= query param (one-time on mount)
  useEffect(() => {
    const param = searchParams.get("referral");
    if (param) {
      const code = param.trim().toUpperCase();
      setValue("referredByCode", code, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateOfBirth = watch("dateOfBirth");
  const email = watch("email");
  const referredByCode = watch("referredByCode") as string | undefined;

  /** Latest selectable date = today minus 18 years (tutor must be ≥ 18) */
  const maxDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return formatDateInputValue(d);
  })();

  useEffect(() => {
    if (!dateOfBirth) return;

    trigger("dateOfBirth");

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
  }, [dateOfBirth, setValue, trigger]);

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
        message: formatError.includes("valid email address")
          ? t("emailInvalid")
          : formatError,
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
          message: isPendingEmailError(result.data.message ?? "")
            ? t("emailPendingApproval")
            : t("emailAlreadyExists"),
        });
        return;
      }

      setEmailAvailability("available");
      if ((errors.email as { type?: string } | undefined)?.type === "server") {
        clearErrors("email");
      }
    }, EMAIL_CHECK_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [
    checkTutorEmailAvailability,
    clearErrors,
    email,
    errors.email,
    setError,
    t,
  ]);

  useEffect(() => {
    const code =
      typeof referredByCode === "string"
        ? referredByCode.trim().toUpperCase()
        : "";
    latestReferralCodeRef.current = code;

    if (!code) {
      setReferralCodeState(null);
      clearErrors("referredByCode");
      return;
    }

    if (!/^[A-Z0-9]+$/.test(code)) {
      setReferralCodeState("invalid");
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const result = await validateReferralCode(code, true);
      if (latestReferralCodeRef.current !== code) return;

      if (!result.data) {
        setReferralCodeState(null);
        return;
      }

      if (result.data.valid) {
        setReferralCodeState("valid");
        clearErrors("referredByCode");
      } else {
        setReferralCodeState("invalid");
        setError("referredByCode", {
          type: "server",
          message: t("referredByCodeInvalid"),
        });
      }
    }, EMAIL_CHECK_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [referredByCode, validateReferralCode, clearErrors, setError, t]);

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
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
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
            aria-label={showConfirm ? t("hidePassword") : t("showPassword")}
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
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={genderOptions}
              defaultSelected={field.value ? [field.value] : []}
              onChange={(selected) => {
                field.onChange(selected[0] ?? "");
                trigger("gender");
              }}
              hasError={!!errors.gender}
              singleSelect
              placeholder={t("genderPlaceholder")}
            />
          )}
        />
        <p className="text-xs leading-4 text-red-500 min-h-4">
          {errors.gender?.message as string}
        </p>
      </div>

      {/* Date of Birth */}
      <InputDatePicker
        name="dateOfBirth"
        label={t("dateOfBirth")}
        required
        maxDate={maxDate}
        helperText={t("dateOfBirthHint")}
        reserveHelperSpace
      />

      {/* Age - auto-calculated */}
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

      {/* Referral Code (optional) */}
      <div className={fieldWrapper}>
        <Label className="text-sm" htmlFor="referredByCode">
          {t("referredByCode")}
        </Label>
        <div className="relative">
          <Input
            id="referredByCode"
            type="text"
            onKeyDown={preventWhitespaceKey}
            {...register("referredByCode", {
              onChange: (e) => {
                const upper = removeWhitespace(e.target.value).toUpperCase();
                setReferralCodeState(null);
                if (
                  (errors.referredByCode as { type?: string } | undefined)
                    ?.type === "server"
                ) {
                  clearErrors("referredByCode");
                }
                if (upper !== e.target.value) {
                  e.target.value = upper;
                  setValue("referredByCode", upper, { shouldValidate: false });
                }
              },
              onBlur: (e) => {
                const upper = removeWhitespace(e.target.value).toUpperCase();
                // Schema validation only checks format, so re-validating here
                // would silently wipe the async "code doesn't exist" error set
                // by the server-side check. Keep that error; onChange clears
                // it as soon as the user edits the code.
                const hasServerError =
                  (errors.referredByCode as { type?: string } | undefined)
                    ?.type === "server";
                setValue("referredByCode", upper, {
                  shouldValidate: !hasServerError,
                });
              },
            })}
            placeholder={t("referredByCodePlaceholder")}
            autoComplete="off"
            maxLength={20}
            className={`${inputClass} pr-10 ${errors.referredByCode ? "border-red-500" : "border-gray-300"}`}
          />
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            {isCheckingReferralCode ? (
              <Spinner className="text-gray-400" />
            ) : errors.referredByCode || referralCodeState === "invalid" ? (
              <Icon name="CircleX" size={18} className="text-red-500" />
            ) : referralCodeState === "valid" ? (
              <Icon name="CircleCheck" size={18} className="text-green-600" />
            ) : null}
          </span>
        </div>
        {errors.referredByCode ? (
          <p className="text-xs leading-4 text-red-500 min-h-4">
            {errors.referredByCode?.message as string}
          </p>
        ) : isCheckingReferralCode ? (
          <Hint>{t("referredByCodeChecking")}</Hint>
        ) : referralCodeState === "valid" ? (
          <p className="text-xs leading-4 text-green-600 min-h-4">
            {t("referredByCodeValid")}
          </p>
        ) : (
          <Hint>{t("referredByCodeHint")}</Hint>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
