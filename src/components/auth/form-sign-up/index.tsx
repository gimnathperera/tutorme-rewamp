"use client";

import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { initialFormValues, SignUpSchema, signUpSchema } from "./schema";
import { useRegisterUserMutation } from "@/store/api/splits/user";
import { getErrorInApiResult } from "@/utils/api";
import { omit } from "lodash-es";
import toast from "react-hot-toast";

type Props = {
  onLoginClick: () => void;
};

const FormSignUp = ({ onLoginClick }: Props) => {
  const signupForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: initialFormValues as SignUpSchema,
    mode: "onChange",
  });

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (data: SignUpSchema) => {
    const result = await registerUser(omit(data, ["confirmPassword"]));
    const error = getErrorInApiResult(result);
    if (error) {
      signupForm.setError("email", {
        type: "manual",
        message: error,
      });
    }

    if (result.data) {
      toast.success("User registered successfully");
      onRegisterSuccess();
    }
  };

  const onRegisterSuccess = () => {
    signupForm.reset();
    onLoginClick();
  };

  return (
    <FormProvider {...signupForm}>
      <form onSubmit={signupForm.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <InputText
            label="Full Name"
            name="name"
            placeholder="Jhon Doe"
            type="text"
          />
          <InputText
            label="Email"
            name="email"
            placeholder="jhon@xyz.com"
            type="email"
          />
          <InputText
            label="Password"
            name="password"
            placeholder="*******"
            type="password"
          />
          <InputText
            label="Confirm Password"
            placeholder="*******"
            type="password"
            name="confirmPassword"
          />
        </div>
        <div className="space-y-2 mt-8">
          <SubmitButton title="Register" type="submit" loading={isLoading} />

          <div className="text-center">
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Already have an account?{" "}
              <span className="text-blue cursor-pointer" onClick={onLoginClick}>
                Login
              </span>
            </p>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormSignUp;
