"use client";

import InputPassword from "@/components/shared/input-password";
import SubmitButton from "@/components/shared/submit-button";
import { useUpdateUserPasswordMutation } from "@/store/api/splits/users";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash-es";
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

  const passwordInfoForm = useForm({
    resolver: zodResolver(passwordInfoSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const { isDirty, errors } = passwordInfoForm.formState;
  const isButtonDisabled = !isDirty || isLoading || !isEmpty(errors);

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
  };

  const onSubmit = (data: PasswordInfoSchema) => {
    handleOnPasswordChangeSubmit(data);
  };

  return (
    <div className="p-4 mb-4 bg-white  rounded-3xl 2xl:col-span-2  sm:p-6">
      <h3 className="mb-4 text-xl font-semibold ">Password information</h3>
      <FormProvider {...passwordInfoForm}>
        <form onSubmit={passwordInfoForm.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols- gap-6">
            <InputPassword
              label="Current password"
              name="currentPassword"
              placeholder="*******"
            />
            <InputPassword
              label="New password"
              name="newPassword"
              placeholder="*******"
            />
            <InputPassword
              label="Confirm password"
              name="confirmPassword"
              placeholder="*******"
            />
          </div>
          <div className="col-span-6 sm:col-full">
            <SubmitButton
              className="peer font-medium rounded-lg text-sm px-5 py-2.5 mt-5 text-center bg-primary-700 text-white hover:bg-primary-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
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
