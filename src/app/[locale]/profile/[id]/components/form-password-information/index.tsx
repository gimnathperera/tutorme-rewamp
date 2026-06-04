"use client";

import InputPassword from "@/components/shared/input-password";
import SubmitButton from "@/components/shared/submit-button";
import { useUpdateUserPasswordMutation } from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { removeWhitespace } from "@/utils/form-normalizers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { ChangeEvent, FC, KeyboardEvent, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import {
  initialFormValues,
  PasswordInfoSchema,
  createPasswordInfoSchema,
} from "./schema";

const preventWhitespaceKey = (event: KeyboardEvent<HTMLInputElement>) => {
  if (/\s/.test(event.key)) {
    event.preventDefault();
  }
};

const FormPasswordInfo: FC = () => {
  const t = useTranslations("profile");
  const passwordInfoSchema = useMemo(() => createPasswordInfoSchema(t), [t]);
  const params = useParams();
  const userId = params?.id as string;

  const [updateProfileUpdate, { isLoading }] = useUpdateUserPasswordMutation();

  const passwordInfoForm = useForm<PasswordInfoSchema>({
    resolver: zodResolver(passwordInfoSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const { isDirty, isValid } = passwordInfoForm.formState;

  const currentPassword = passwordInfoForm.watch("currentPassword");
  const newPassword = passwordInfoForm.watch("newPassword");
  const confirmPassword = passwordInfoForm.watch("confirmPassword");

  const areAllFieldsFilled =
    !!currentPassword?.trim() &&
    !!newPassword?.trim() &&
    !!confirmPassword?.trim();

  const isButtonDisabled =
    !isDirty || !areAllFieldsFilled || !isValid || isLoading;

  const handleOnPasswordChangeSubmit = async (data: PasswordInfoSchema) => {
    const submitData = {
      id: userId,
      payload: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
    };

    const result = await updateProfileUpdate(submitData);
    const error = getErrorInApiResult(result);

    if (error) {
      return toast.error(error);
    }

    toast.success(t("passwordUpdated"));
    passwordInfoForm.reset();
  };

  const onSubmit = (data: PasswordInfoSchema) => {
    handleOnPasswordChangeSubmit(data);
  };

  const sanitizePasswordField =
    (fieldName: keyof PasswordInfoSchema) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const noSpaces = removeWhitespace(event.target.value);
      if (noSpaces !== event.target.value) {
        event.target.value = noSpaces;
      }
      passwordInfoForm.setValue(fieldName, noSpaces, {
        shouldValidate: true,
        shouldDirty: true,
      });
    };

  return (
    <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 2xl:col-span-2">
      <h3 className="mb-2 text-lg font-semibold sm:text-xl">
        {t("accountSecurityTitle")}
      </h3>
      <p className="mb-5 text-sm text-gray-500">{t("accountSecurityDesc")}</p>

      <FormProvider {...passwordInfoForm}>
        <form onSubmit={passwordInfoForm.handleSubmit(onSubmit)}>
          <div className="grid max-w-xl grid-cols-1 gap-4 sm:gap-5">
            <InputPassword
              label={t("fieldCurrentPassword")}
              name="currentPassword"
              placeholder={t("placeholderCurrentPassword")}
              onKeyDown={preventWhitespaceKey}
              onChange={sanitizePasswordField("currentPassword")}
            />
            <InputPassword
              label={t("fieldNewPassword")}
              name="newPassword"
              placeholder={t("placeholderNewPassword")}
              onKeyDown={preventWhitespaceKey}
              onChange={sanitizePasswordField("newPassword")}
            />
            <InputPassword
              label={t("fieldConfirmPassword")}
              name="confirmPassword"
              placeholder={t("placeholderConfirmPassword")}
              onKeyDown={preventWhitespaceKey}
              onChange={sanitizePasswordField("confirmPassword")}
            />
          </div>

          <div className="max-w-xl">
            <SubmitButton
              className="peer mt-4 rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:mt-5 sm:px-5 sm:text-base"
              type="submit"
              loading={isLoading}
              title={t("changePassword")}
              disabled={isButtonDisabled}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FormPasswordInfo;
