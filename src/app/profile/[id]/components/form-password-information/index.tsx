"use client";

import InputPassword from "@/components/shared/input-password";
import SubmitButton from "@/components/shared/submit-button";
import { useUpdateUserPasswordMutation } from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  initialFormValues,
  PasswordInfoSchema,
  passwordInfoSchema,
} from "./schema";

const FormPasswordInfo: FC = () => {
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

    toast.success("Password updated successfully");
    passwordInfoForm.reset();
  };

  const onSubmit = (data: PasswordInfoSchema) => {
    handleOnPasswordChangeSubmit(data);
  };

  return (
    <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 2xl:col-span-2">
      <h3 className="mb-2 text-lg font-semibold sm:text-xl">
        Account Security
      </h3>
      <p className="mb-5 text-sm text-gray-500">
        Change your password using your current password for verification.
      </p>

      <FormProvider {...passwordInfoForm}>
        <form onSubmit={passwordInfoForm.handleSubmit(onSubmit)}>
          <div className="grid max-w-xl grid-cols-1 gap-4 sm:gap-5">
            <InputPassword
              label="Current password *"
              name="currentPassword"
              placeholder="Enter current password"
            />
            <InputPassword
              label="New password *"
              name="newPassword"
              placeholder="Enter new password"
            />
            <InputPassword
              label="Confirm password *"
              name="confirmPassword"
              placeholder="Re-enter new password"
            />
          </div>

          <div className="max-w-xl">
            <SubmitButton
              className="peer mt-4 rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 sm:mt-5 sm:px-5 sm:text-base"
              type="submit"
              loading={isLoading}
              title="Change Password"
              disabled={isButtonDisabled}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FormPasswordInfo;
