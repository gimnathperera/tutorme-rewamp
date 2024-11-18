import InputText from "@/components/shared/input-text";
import SubmitButton from "@/components/shared/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SignUpSchema, signUpSchema } from "./schema";

type Props = {
  onLoginClick: () => void;
};

const FormSignUp = ({ onLoginClick }: Props) => {
  const signupForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {} as SignUpSchema,
    mode: "onChange",
  });

  const onSubmit = (data: SignUpSchema) => {
    console.log("Form Submitted", data);
  };

  return (
    <FormProvider {...signupForm}>
      <form onSubmit={signupForm.handleSubmit(onSubmit)}>
        <div className="space-y-4">
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
          <SubmitButton title="Register" type="submit" />

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
